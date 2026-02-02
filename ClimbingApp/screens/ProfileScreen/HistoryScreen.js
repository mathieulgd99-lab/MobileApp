import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import { useFocusEffect} from '@react-navigation/native';
import styles from '../styles';
import { AuthContext } from '../../context/AuthContext';
import useBoulders from '../Hooks/useBoulder';
import useComment from '../Hooks/useComment';
import useBoulderModal from '../Hooks/useBoulderModal';
import {
  getValidatedBoulders,
  getBoulderVideos,
  deleteVideos
} from '../../api/auth';

import PlayVideoModal from '../../components/PlayVideoModal';
import BlocksList from '../../components/BlockList';
import BoulderModal from '../../components/BoulderModal';
import CommentsModal from '../../components/CommentsModal';
import useUIModal from '../Hooks/useUIModal';

//const API_BASE = "http://192.168.1.165:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;


export default function HistoryScreen({ profileUser, token: tokenProp }) {
  const { token: tokenFromCtx, user } = useContext(AuthContext);
  const authToken = tokenProp || tokenFromCtx;

  const [showAll, setShowAll] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [videos, setVideos] = useState([]);


  const imageModal = useBoulderModal();
  const uiModal = useUIModal();
  const {
    error,
    validatedBoulders,
    grades,
    setValidatedBoulders,
    deleteBoulder,
    archiveBoulder,
    countGrade,
    isValidated,
    countValidatedGrade
  } = useBoulders(authToken, profileUser?.id);


  const {
    comments,
    commentsModal,
    openComments,
    closeComments,
    removeComment,
    getCommentCount,
    initCommentCounts,
  } = useComment(authToken);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          const validated = await getValidatedBoulders(authToken);
          if (!active) return;
            setValidatedBoulders(validated.boulders);
        } catch (err) {
          console.error('Error loading history-validatedboulders', err);
          setValidatedBoulders([]);
        } finally {
          if (active) setLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, [getValidatedBoulders,setValidatedBoulders,authToken])
  );

  useEffect(() => {
    if (validatedBoulders?.length) {
      initCommentCounts(validatedBoulders);
    }
  }, [validatedBoulders]);



  const filteredBoulders = validatedBoulders.filter(b => {
    if (!showAll && b.archived_at) return false;
    if (selectedGrade && b.grade !== selectedGrade) return false;
    return true;
  });

  const activeBoulder =
  uiModal.payload?.boulderId
    ? validatedBoulders.find(b => b.id === uiModal.payload.boulderId)
    : null;
  
  async function openVideos(boulderId) {
    try {
      setVideos([]);
  
      const res = await getBoulderVideos(boulderId, authToken);
      console.log("res getbouldervideos: ",res)
      if (!res.error) {
        setVideos(res.videos || []);
      } else {
        console.log('Erreur getBoulderVideos:', res.error);
      }
    } catch (err) {
      console.error('Erreur openVideos:', err);
    }
  }
  async function handleRemoveVideo(video) {
    await deleteVideo(video.id, authToken);
    setVideos(videos.filter(v => v.id !== video.id));
  }

  const archivedFilter = () => setShowAll(prev => !prev);

  const handleOpenComments = async (boulderId) => {
    await openComments(boulderId);
    uiModal.switchTo('comments', { boulderId });
  };

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const renderGrade =  ({item}) => {
    const isSelected = selectedGrade === item.difficulty;
    const count = showAll ? countValidatedGrade(item.difficulty,true) + countValidatedGrade(item.difficulty,false) : countValidatedGrade(item.difficulty,false)
    return (
      <TouchableOpacity
        onPress={() => handleClickGrade(item.difficulty)}
        activeOpacity={0.8}
        style={[
          localStyles.gradeChip,
          isSelected && localStyles.gradeChipSelected,
        ]}
      >
        <Text
          style={[
            localStyles.gradeText,
            isSelected && localStyles.gradeTextSelected,
          ]}
        >
          {item.difficulty}
        </Text>
  
        <Text style={localStyles.gradeCount}>
          {count}/{count}
        </Text>
      </TouchableOpacity>
    )
  }

  if (loading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur</Text>;

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.header}>Validated boulders</Text>

      <View style={localStyles.controls}>
        <TouchableOpacity
          onPress={archivedFilter}
          style={[localStyles.toggleButton, showAll ? localStyles.toggleOn : localStyles.toggleOff]}
        >
          <Text style={localStyles.toggleText}>
            {showAll ? 'Show : Everything' : 'Show : Current only'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Boulders</Text>

          <FlatList
            data={grades}
            horizontal
            keyExtractor={(grade) => grade.id}
            renderItem={renderGrade}
            scrollEnabled={true}
            contentContainerStyle={localStyles.gradeList}
            extraData={selectedGrade}
          />
      </View>
    <ScrollView>
      <BlocksList
          boulders={filteredBoulders}
          validatedBoulders={validatedBoulders}
          onPressImage={(boulder) => uiModal.open('boulder', { boulderId: boulder.id })}
          onOpenVideos={async (boulder) => {
            await openVideos(boulder.id);
            uiModal.switchTo('videos', { boulderId: boulder.id });
          }}
          onOpenComments={(id) => handleOpenComments(id)}
          getCommentCount={getCommentCount}
          onToggleValidation={() => { /* history read-only: noop */ }}
          imageBase={API_BASE}
          onDeleteBoulder={deleteBoulder}
          onArchiveBoulder={archiveBoulder}
          userRole={user.role}
        />
    {/* -------- IMAGE MODAL -------- */}
      <Modal
        visible={uiModal.visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={uiModal.close}
      >
        {/* Boulder view */}
        {uiModal.type === 'boulder' && activeBoulder && (
          <BoulderModal
            boulder={activeBoulder}
            imageBase={API_BASE}
            isValidated={isValidated(uiModal.payload?.boulderId)}
            onClose={uiModal.close}
            onOpenComments={async (id) => {
              await openComments(id);
              uiModal.switchTo('comments', { boulderId: id });
            }}
            commentCount={getCommentCount(activeBoulder.id)}
            canValidate={false}
            isHistory={true}
            onOpenVideos={async (boulder) => {
              await openVideos(boulder.id);
              uiModal.switchTo('videos', { boulderId: boulder.id });
            }}
          />
        )}

        {/* Comments */}
        {uiModal.type === 'comments' && (
          <CommentsModal
            comments={comments}
            user={user}
            onRemoveComment={removeComment}
            onClose={uiModal.back}
            canPost={false}
          />
        )}
        {uiModal.type === 'videos' && activeBoulder && (
          <PlayVideoModal
          videos={videos}
          user={user}
          onClose={uiModal.back}
          onRemove={handleRemoveVideo}
          />
        )}
        </Modal>
      </ScrollView>
    </View>
  )
}
const localStyles = StyleSheet.create({

  deleteButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#ff5252',
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    color: 'white',
    fontSize: 18,
    marginBottom: 12,
    alignSelf: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toggleOn: {
    backgroundColor: '#4CAF50',
  },
  toggleOff: {
    backgroundColor: '#1d357d',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
  count: {
    color: 'white',
    fontSize: 14,
  },
  list: {
    paddingBottom: 40,
  },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    color: 'white',
    fontWeight: '700',
  },
  itemSub: {
    color: '#cccccc',
    marginTop: 4,
  },
  empty: {
    color: 'white',
    alignSelf: 'center',
  },

  gradeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  
  gradeChipSelected: {
    backgroundColor: '#357756',
  },
  
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  
  gradeTextSelected: {
    color: '#121212',
  },
  
  gradeCount: {
    fontSize: 11,
    marginTop: 2,
    color: '#B0B0B0',
  },
});