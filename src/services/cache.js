// A small in-memory cache for Fake API requests.
// There is no direct localStorage access in React components.
const CACHE_TTL_MS = 30_000;
const entries = new Map();
const pending = new Map();
let generation = 0;

export function getCached(key, loader) {
  const existing = entries.get(key);

  if (existing && Date.now() < existing.expiresAt) {
    return Promise.resolve(existing.value);
  }

  if (pending.has(key)) {
    return pending.get(key);
  }

  const currentGeneration = generation;
  const request = Promise.resolve()
    .then(loader)
    .then((value) => {
      // Requests started before a mutation must NOT refill an invalid cache.
      if (currentGeneration === generation) {
        entries.set(key, {
          value,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
      }
      return value;
    })
    .finally(() => {
      if (pending.get(key) === request) {
        pending.delete(key);
      }
    });

  pending.set(key, request);
  return request;
}

export function invalidateTasksCache() {
  generation += 1;
  entries.clear();
  pending.clear();
}

export function revalidateTasksCache() {
  invalidateTasksCache();
}

export const cacheSettings = { ttlMs: CACHE_TTL_MS };
