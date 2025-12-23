import { useState, useEffect, useCallback } from 'react';
import {
  getBoulders,
  markBoulderAsCompleted,
  getValidatedBoulders,
  archiveBoulders,
  deleteBoulders,
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
        return { ok: false, error: err.message || 'Error validation' };
      }
    },
    [token]
  );

  const deleteBoulder = useCallback(
    async (boulder) => {
      if (!token){
        throw new Error('Admin token required to delete a boulder')
      }
      try {
        const res = await deleteBoulders(token,boulder.id);
        if (!res.error){
          await refresh();
          return true
        }
      } catch (err) {
        return 'Error delete';
      }
    },
    [token]
  )

  const archiveBoulder = useCallback(
    async (boulder) => { 
      if (!token){
        throw new Error('Admin token required to archive a boulder')
      }
      try {
        const res = await archiveBoulders(token, boulder.id);
        if (!res.error){
          await refresh();
          return true
        }
        return false
      } catch (err) {
        return 'Error archived'
      }
    },
    [token]
  )
  const isValidated = (id) =>
    validatedBoulders.some((b) => b.id === id);
  
  const getFiltered = ({ zone = null, grade = null, archived = null } = {}) => {
    let res = boulders;
    if (archived) res = res.filter(b => !b.archived_at)
    if (zone) res = res.filter(b => b.zoneId === zone);
    if (grade) res = res.filter(b => b.grade === grade);
    return res;
  };
  
  const countGrade = (difficulty) =>
    boulders.filter(b => b.grade === difficulty).length;

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
    archiveBoulder,
    deleteBoulder
  };
}

export default useBoulders;
