import { useState, useCallback } from 'react';
import { getComment, addComment, deleteComment } from '../../api/auth';

export function useComment(token = null) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = useCallback(
    async (boulderId) => {
      if (!boulderId) return { ok: false, error: 'boulderId missing' };
      setLoadingComments(true);
      setError(null);
      try {
        const res = await getComment(token, boulderId);
        if (!res.error) {
          setComments(res.comments || []);
          return { ok: true, comments: res.comments || [] };
        } else {
          setComments([]);
          setError(res.error);
          return { ok: false, error: res.error };
        }
      } catch (err) {
        setError(err.message || 'Erreur réseau');
        return { ok: false, error: err.message || 'Erreur réseau' };
      } finally {
        setLoadingComments(false);
      }
    },
    [token]
  );

  const postComment = useCallback(
    async (boulderId, content) => {
      if (!token) return { ok: false, error: 'Token required' };
      if (!boulderId) return { ok: false, error: 'boulderId missing' };
      if (!content || !content.trim()) return { ok: false, error: 'Empty content' };

      setPosting(true);
      try {
        const res = await addComment(token, content.trim(), boulderId);
        if (!res.error) {
          // reload comments to keep coherence
          await loadComments(boulderId);
          return { ok: true };
        } else {
          return { ok: false, error: res.error };
        }
      } catch (err) {
        return { ok: false, error: err.message || 'Erreur réseau' };
      } finally {
        setPosting(false);
      }
    },
    [token, loadComments]
  );

  const removeComment = useCallback(
    async (boulderId, commentId) => {
      if (!token) return { ok: false, error: 'Token required' };
      if (!commentId) return { ok: false, error: 'commentId missing' };

      setDeleting(true);
      try {
        const res = await deleteComment(token, commentId);
        if (!res.error) {
          // reload comments pour coherence si boulderId fourni
          if (boulderId) {
            await loadComments(boulderId);
          }
          return { ok: true };
        } else {
          return { ok: false, error: res.error };
        }
      } catch (err) {
        return { ok: false, error: err.message || 'Erreur réseau' };
      } finally {
        setDeleting(false);
      }
    },
    [token, loadComments]
  );

  return {
    comments,
    loadingComments,
    posting,
    deleting,
    error,
    loadComments,
    postComment,
    removeComment,
    setComments, // exposure utile pour manipulations locales
  };
}

export default useComment;
