import { useState, useEffect, useCallback } from 'react';
import {
  getBoulders,
  markBoulderAsCompleted,
  getValidatedBoulders,
  archiveBoulders,
  deleteBoulders,
  getLeaderboard,
  getUserBoulders
} from '../../api/auth';


export function useBoulders(token,userId = null) {
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
        setBoulders([]);
        setError(res.error || 'Erreur getBoulders');
      }

      const valid = userId ? await getUserBoulders(userId, token) : await getValidatedBoulders(token);
      if (!valid.error) {
        setValidatedBoulders(valid.boulders || []);
      } else {
        console.log("Error dans loadALl useBoulder")
        setValidatedBoulders([]);
        setError((prev) => prev || valid.error || 'Erreur getValidatedBoulders');
      }
    } catch (err) {
      setError(err.message || 'Erreur loadAll');
      setBoulders([]);
      setValidatedBoulders([]);
    } finally {
      setLoading(false);
    }
  }, [token,userId]);

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
  
        if (res?.error) {
          return { ok: false, error: res.error };
        }
  
        setValidatedBoulders((prev) => {
          if (res.validated) {
            if (prev.some((b) => b.id === boulder.id)) return prev;
            return [...prev, boulder];
          }
          return prev.filter((b) => b.id !== boulder.id);
        });
  
        if (res.boulder) {
          setBoulders((prev) =>
            prev.map((b) =>
              b.id === boulder.id
                ? { ...b, ...res.boulder }
                : b
            )
          );
        }
  
        return {
          ok: true,
          validated: res.validated,
          boulder: res.boulder,
        };
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
    [token, refresh]
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
          return res
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
    let res = [...boulders];
    if (archived === true) res = res.filter((b) => b.archived_at); // archivés
    else if (archived === false) res = res.filter((b) => !b.archived_at); // non archivés
    if (zone) res = res.filter((b) => b.zone_id === zone);
    if (grade) res = res.filter((b) => b.grade === grade);
    return res;
  };
  
  const countGrade = (difficulty, archived = null) => {
    return boulders.filter(b => {
      if (b.grade !== difficulty) return false;
  
      if (archived === true) return !!b.archived_at;
      if (archived === false) return !b.archived_at;
  
      return true;
    }).length;
  };
  

  const countValidatedGrade = (difficulty, archived = null) => {
    return validatedBoulders.filter(b => {
      if (b.grade !== difficulty) return false;
  
      if (archived === true) return !!b.archived_at;
      if (archived === false) return !b.archived_at;
  
      return true;
    }).length;
  };
  

  const grades = [
    { id:'1', difficulty: 1},
    { id:'2', difficulty: 2},
    { id:'3', difficulty: 3},
    { id:'4', difficulty: 4},
    { id:'5', difficulty: 5},
    { id:'6', difficulty: 6},
    { id:'7', difficulty: 7},
    { id:'8', difficulty: 8},
    { id:'9', difficulty: 9},
    { id:'10', difficulty: 10},
    { id:'11', difficulty: 11},
    { id:'12', difficulty: 12},
    { id:'13', difficulty: 13},
    { id:'14', difficulty: 14},
  ]

  const getTotalPoint = useCallback(
    async (token) => { 
      if (!token){
        throw new Error('Token required to see the leaderboard')
      }
      try {
        const res = await getLeaderboard(token);
        console.log("res leaderboard : ",res)
        return res
      } catch (err) {
        return 'Error archived'
      }
    },
    [token]
  )

  const getEachUserPoint = useCallback(
    async (user) => { 
      if (!token){
        throw new Error('Token required to see the leaderboard')
      }
      try {
        const res = await getUserPoints(token,user.id);
        console.log("res point for user : ",user.display_name, "points : ",res)
        return true
      } catch (err) {
        return 'Error archived'
      }
    },
    [token]
  )
  return {
    boulders,
    validatedBoulders,
    setValidatedBoulders,
    setBoulders,
    loading,
    refreshing,
    error,
    grades,
    refresh,
    toggleValidation,
    isValidated,
    getFiltered,
    countGrade,
    archiveBoulder,
    deleteBoulder,
    getTotalPoint,
    getEachUserPoint,
    countValidatedGrade
  };
}

export default useBoulders;
