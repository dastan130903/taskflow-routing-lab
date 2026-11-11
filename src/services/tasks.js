import {
  createItem as createOnServer,
  deleteItem as deleteOnServer,
  getItem as fetchItem,
  getItemsList as fetchItemsList,
  updateItem as updateOnServer,
} from './service.js';
import { getCached, invalidateTasksCache, revalidateTasksCache } from './cache.js';

// Query keys distinguish the list from each individual detail record.
export function getItemsList() {
  return getCached('tasks:list', fetchItemsList);
}

export function getItem(id) {
  return getCached(`tasks:detail:${id}`, () => fetchItem(id));
}

export async function createItem(input) {
  const result = await createOnServer(input);
  invalidateTasksCache();
  return result;
}

export async function updateItem(id, changes) {
  const result = await updateOnServer(id, changes);
  invalidateTasksCache();
  return result;
}

export async function deleteItem(id) {
  const result = await deleteOnServer(id);
  invalidateTasksCache();
  return result;
}

export { revalidateTasksCache };
