import { useState, useEffect, useCallback } from 'react';
import {
  getBoulders,
  markBoulderAsCompleted,
  getValidatedBoulders,
} from '../../api/auth';


export function useBoulders(token) {
  const [boulders, setBoulders] = useState([]);
  const [validatedBoulders, setValidatedBoulders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBoulders(token);
      if (!res.error) {
        setBoulders(res.boulders || []);
      } else {
        setError(res.error || 'Erreur getBoulders');
      }
    const valid = await getValidatedBoulders(token);
    if (!valid.error) {
        setValidatedBoulders(valid.boulders || []);
    } else {
        setError(res.error || 'Erreur getValidatedBoulders');
    }
      
    } catch (err) {
      setError(err.message || 'Erreur loadAll');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }, [loadAll]);



  const toggleValidation = useCallback(
    async (boulder) => {
      if (!token) {
        throw new Error('Token required to validate a boulder');
      }
      try {
        const res = await markBoulderAsCompleted(boulder.id, token);
        if (!res.error) {
          if (res.validated) {
            setValidatedBoulders((prev) => {
              if (prev.some((b) => b.id === boulder.id)) return prev;
              return [...prev, boulder];
            });
          } else {
            setValidatedBoulders((prev) => prev.filter((b) => b.id !== boulder.id));
          }
          return { ok: true, validated: res.validated };
        } else {
          return { ok: false, error: res.error };
        }
      } catch (err) {
        return { ok: false, error: err.message || 'Erreur réseau' };
      }
    },
    [token]
  );

  const isValidated = useCallback(
    (id) => {
      return validatedBoulders.some((b) => b.id === id);
    },
    [validatedBoulders]
  );

  const getFiltered = useCallback(
    ({ zone = null, grade = null } = {}) => {
      let res = boulders;
      if (zone && grade) {
        res = boulders.filter((b) => b.zoneId === zone && b.grade === grade);
      } else if (zone) {
        res = boulders.filter((b) => b.zoneId === zone);
      } else if (grade) {
        res = boulders.filter((b) => b.grade === grade);
      }
      return res;
    },
    [boulders]
  );

  const countGrade = useCallback(
    (difficulty) => {
      return boulders.reduce((acc, b) => (b.grade === difficulty ? acc + 1 : acc), 0);
    },
    [boulders]
  );

  return {
    boulders,
    validatedBoulders,
    loading,
    refreshing,
    error,
    refresh,
    toggleValidation,
    isValidated,
    getFiltered,
    countGrade,
  };
}

export default useBoulders;
