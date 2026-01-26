import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  getComment,
  addComment,
  deleteComment,
} from '../../api/auth';

export default function useComment(token) {
  const [comments, setComments] = useState([]);
  const [postingComment, setPostingComment] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const [currentBoulderId, setCurrentBoulderId] = useState(null);
  const [newComment, setNewComment] = useState('');

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
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const closeComments = useCallback(() => {
    setCurrentBoulderId(null);
    setComments([]);
  }, []);

  /* ---------------- ADD / REMOVE ---------------- */

  const addNewComment = useCallback(async () => {
    if (!newComment.trim() || !currentBoulderId || !token) return;
  
    setPostingComment(true);
    try {
      await addComment(token, newComment.trim(), currentBoulderId);
  
      const res = await getComment(token, currentBoulderId);
      if (!res?.error) {
        setComments(res.comments || []);
        setCommentCounts(prev => ({
          ...prev,
          [currentBoulderId]: res.comments.length,
        }));
      }
  
      setNewComment('');
    } finally {
      setPostingComment(false);
    }
  }, [token, currentBoulderId, newComment]);
  

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
    newComment,
    setNewComment,
    postingComment,
    commentCounts,
    addNewComment,
    removeComment,
    getCommentCount,
    initCommentCounts,
    openComments
  };
}
