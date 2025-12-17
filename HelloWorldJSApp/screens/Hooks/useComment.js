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


  const initCommentCounts = useCallback(async (boulders) => {
    if (!token || !boulders?.length) return;
  
    const counts = {};
  
    for (const boulder of boulders) {
      try {
        const res = await getComment(token, boulder.id);
        if (!res.error) {
          counts[boulder.id] = res.comments.length;
        }
      } catch (e) {
        counts[boulder.id] = 0;
      }
    }
  
    setCommentCounts(counts);
  }, [token]);

  const openComments = useCallback(async (boulderId) => {
    if (!boulderId) return;
  
    setCurrentBoulderId(boulderId);
  
    try {
      const res = await getComment(token, boulderId);
      if (!res.error) {
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

  const getCommentCount = (boulderId) =>
    commentCounts[boulderId] ?? 0;
  
  const addNewComment = useCallback(
    async (content) => {
      if (!content.trim() || !currentBoulderId) {
        Alert.alert('Erreur', 'Commentaire invalide');
        return;
      }
  
      setPostingComment(true);
      try {
        const res = await addComment(token, content.trim(), currentBoulderId);
        if (!res.error) {
          await openComments(currentBoulderId);
        }
      } finally {
        setPostingComment(false);
      }
    },
    [token, currentBoulderId, openComments]
  );
  

  const removeComment = useCallback(
    async (commentId) => {
      if (!currentBoulderId) return;
  
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
    },
    [token, currentBoulderId, openComments]
  );

  const closeComments = () => {
    setCommentsModal(false);
  };

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
