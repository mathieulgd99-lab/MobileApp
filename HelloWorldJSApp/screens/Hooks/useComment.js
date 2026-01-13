import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  getComment,
  addComment,
  deleteComment,
} from '../../api/auth';

export default function useComment(token) {
  const [comments, setComments] = useState([]);
  const [commentsModal, setCommentsModal] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const [currentBoulderId, setCurrentBoulderId] = useState(null);

  /* ---------------- COUNTS ---------------- */

  const initCommentCounts = useCallback(async (boulders) => {
    if (!token || !boulders?.length) return;

    const counts = {};
    for (const boulder of boulders) {
      try {
        const res = await getComment(token, boulder.id);
        counts[boulder.id] = res?.comments?.length ?? 0;
      } catch {
        counts[boulder.id] = 0;
      }
    }
    setCommentCounts(counts);
  }, [token]);

  const getCommentCount = (boulderId) =>
    commentCounts[boulderId] ?? 0;

  /* ---------------- OPEN / CLOSE ---------------- */

  const openComments = useCallback(async (boulderId) => {
    if (!token || !boulderId) return;

    
    setCurrentBoulderId(boulderId);

    try {
      const res = await getComment(token, boulderId);
      if (!res?.error) {
        setComments(res.comments || []);
        setCommentCounts(prev => ({
          ...prev,
          [boulderId]: res.comments.length,
        }));
        setCommentsModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const closeComments = useCallback(() => {
    setCommentsModal(false);
    setCurrentBoulderId(null);
    setComments([]);
  }, []);

  /* ---------------- ADD / REMOVE ---------------- */

  const addNewComment = useCallback(async (content) => {
    if (!content.trim() || !currentBoulderId || !token) return;

    setPostingComment(true);
    try {
      await addComment(token, content.trim(), currentBoulderId);

      // 🔁 refresh comments
      const res = await getComment(token, currentBoulderId);
      if (!res?.error) {
        setComments(res.comments || []);
        setCommentCounts(prev => ({
          ...prev,
          [currentBoulderId]: res.comments.length,
        }));
      }
    } finally {
      setPostingComment(false);
    }
  }, [token, currentBoulderId]);

  const removeComment = useCallback((commentId) => {
    if (!token || !currentBoulderId) return;

    Alert.alert('Confirm', 'Delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteComment(token, commentId);
          await openComments(currentBoulderId);
        },
      },
    ]);
  }, [token, currentBoulderId, openComments]);

  /* ---------------- EXPORT ---------------- */

  return {
    comments,
    commentsModal,
    postingComment,
    openComments,
    closeComments,
    addNewComment,
    removeComment,
    getCommentCount,
    initCommentCounts,
  };
}
