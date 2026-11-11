import { useEffect, useState } from 'react';
import { getItemsList, revalidateTasksCache } from '../services/tasks.js';

export default function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    getItemsList()
      .then((response) => {
        if (!ignore) {
          setItems(response.data);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    // Ignore a response from an old effect after a route change or reload.
    return () => {
      ignore = true;
    };
  }, [version]);

  function reload() {
    revalidateTasksCache();
    setVersion((previous) => previous + 1);
  }

  return { items, loading, error, reload };
}
