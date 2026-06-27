/**
 * useFirestore hook — generic Firestore fetch/mutation wrapper.
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic async data fetching hook
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependencies for re-fetching
 */
export const useFirestore = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      if (import.meta.env.DEV) {
        console.error('useFirestore error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
};
