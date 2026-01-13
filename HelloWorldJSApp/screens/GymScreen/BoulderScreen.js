import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  Text,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import styles from '../styles';
import {
  getBoulders,
  getValidatedBoulders,
} from '../../api/auth';

import { AuthContext } from '../../context/AuthContext';

import useBoulders from '../Hooks/useBoulder';
import useComment from '../Hooks/useComment';
import useUIModal from '../Hooks/useUIModal';

import BlocksList from '../../components/BlockList';
import BoulderModal from '../../components/BoulderModal';
import CommentsModal from '../../components/CommentsModal';
import UploadVideoModal from '../../components/UploadVideoModal';
import PlayVideoModal from '../../components/PlayVideoModal';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function BoulderScreen() {
  const { user, token } = useContext(AuthContext);

  const zones = [
    { label: 'Mur Coin', points: '40,300 20,300 20,400 80,400 60,380 40,380' },
    { label: 'Mur Dalle', points: '20,300 40,300 50,250 40,200 20,200' },
    { label: 'Mur Tension', points: '20,200 40,200 40,120 20,100' },
    { label: 'Mur Toit', points: '20,100 40,120 50,80 120,80 130,50 40,50' },
    { label: 'Mur Dynamique', points: '130,50 120,80 220,80 220,50' },
    { label: 'Mur Porte', points: '220,50 320,50 320,120 295,120 295,80 220,80' },
    { label: 'Mur Devers', points: '295,120 320,120 320,230 295,230 295,210 280,190 295,160' },
    { label: 'Mur Diedre', points: '295,230 320,230 320,290 295,270' },
    { label: 'Mur Angle', points: '295,270 320,290 250,290 260,270' },
    { label: 'Mur Easy', points: '295,325 320,325 320,400 250,400 250,380 295,380' },
  ];

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [newComment, setNewComment] = useState('');

  const uiModal = useUIModal();

  const {
    loading,
    boulders,
    grades,
    validatedBoulders,
    getFiltered,
    toggleValidation,
    isValidated,
    countGrade,
    countValidatedGrade,
    deleteBoulder,
    archiveBoulder,
    setBoulders,
    setValidatedBoulders,
    setLoading,
  } = useBoulders(token);

  const {
    comments,
    postingComment,
    addNewComment,
    removeComment,
    getCommentCount,
    initCommentCounts,
  } = useComment(token);

  useEffect(() => {
    (async () => {
      const res = await getBoulders();
      const validated = await getValidatedBoulders(token);

      if (!res.error) setBoulders(res.boulders);
      if (!validated.error) setValidatedBoulders(validated.boulders);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (boulders.length > 0) {
      initCommentCounts(boulders);
    }
  }, [boulders]);

  const filteredBoulders = getFiltered({
    zone: selectedZone,
    grade: selectedGrade,
    archived: false,
  });

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const handleClickZone = (zoneLabel) => {
    setSelectedZone(prev => prev === zoneLabel ? null : zoneLabel);
  };

  function handleUploadVideo(boulder) {
    setActiveBoulder(boulder);
    setUploadVideoVisible(true);
  }
  
  function handleCloseUploadVideo() {
    setUploadVideoVisible(false);
    setActiveBoulder(null);
  }

  async function openVideos(boulderId) {
    try {
      setShowVideos(true);
      setVideos([]);
  
      const res = await getBoulderVideos(boulderId, token);
      console.log("res : ",res)
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
    await deleteVideo(video.id, token);
    setVideos(videos.filter(v => v.id !== video.id));
  }
  

 
  async function handleSubmitVideo(data) {
    if (!activeBoulder) return;
    console.log("Boulderscreen await createbouldervideo")
    const res = await createBoulderVideo(
      activeBoulder.id,
      data,
      token
    );
    console.log("Boulderscreen finish createbouldervideo")
    if (!res.error) {
      setUploadVideoVisible(false);
    }
  }
  
  
  const renderGrade = ({ item }) => {
    const isSelected = selectedGrade === item.difficulty;
  
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
          {countValidatedGrade(item.difficulty,false)}/{countGrade(item.difficulty,false)}
        </Text>
      </TouchableOpacity>
    );
  };


  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }} style={{ backgroundColor: '#121212' }}>
        <Svg height="450" width="350" style={styles.map}>
          {zones.map(zone => (
            <Polygon
              key={zone.label}
              points={zone.points}
              fill={selectedZone === zone.label ? '#8bc34a' : '#808080'}
              stroke="#fff"
              strokeWidth="1"
              onPressOut={() =>
                setSelectedZone(prev => (prev === zone.label ? null : zone.label))
              }
            />
          ))}
        </Svg>

        <FlatList
          data={grades}
          horizontal
          keyExtractor={g => g.id}
          contentContainerStyle={localStyles.gradeList}
          renderItem={({ item }) => {
            const selected = selectedGrade === item.difficulty;
            return (
              <TouchableOpacity
                style={[localStyles.gradeChip, selected && localStyles.gradeChipSelected]}
                onPress={() =>
                  setSelectedGrade(prev =>
                    prev === item.difficulty ? null : item.difficulty
                  )
                }
              >
                <Text style={[localStyles.gradeText, selected && localStyles.gradeTextSelected]}>
                  {item.difficulty}
                </Text>
                <Text style={localStyles.gradeCount}>
                  {countValidatedGrade(item.difficulty)}/{countGrade(item.difficulty)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <BlocksList
          boulders={filteredBoulders}
          validatedBoulders={validatedBoulders}
          onPressImage={boulder => uiModal.open('boulder', boulder)}
          onOpenComments={id => uiModal.switchTo('comments', { boulderId: id })}
          onToggleValidation={toggleValidation}
          getCommentCount={getCommentCount}
          imageBase={API_BASE}
          onDeleteBoulder={deleteBoulder}
          onArchiveBoulder={archiveBoulder}
          userRole={user.role}
        />
      </ScrollView>

      {/* MODAL UNIQUE */}
      <Modal
        visible={uiModal.visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={uiModal.close}
      >
        {uiModal.type === 'boulder' && (
          <BoulderModal
            boulder={uiModal.payload}
            imageBase={API_BASE}
            isValidated={isValidated(uiModal.payload?.id)}
            onToggleValidation={toggleValidation}
            onClose={uiModal.close}
            onOpenComments={id =>
              uiModal.switchTo('comments', { boulderId: id })
            }
            onUploadVideo={b =>
              uiModal.switchTo('upload', { boulder: b })
            }
            onOpenVideos={b =>
              uiModal.switchTo('videos', { boulder: b })
            }
          />

        )}

        {uiModal.type === 'comments' && (
          <CommentsModal
            visible
            comments={comments}
            user={user}
            newComment={newComment}
            setNewComment={setNewComment}
            postingComment={postingComment}
            onAddComment={addNewComment}
            onRemoveComment={removeComment}
            onClose={uiModal.close}
          />
        )}

        {uiModal.type === 'upload' && (
          <UploadVideoModal
            boulder={uiModal.payload.boulder}
            onClose={uiModal.back} // ⬅️ RETOUR fluide vers le bloc 
            />
        )}

        {uiModal.type === 'videos' && (
          <PlayVideoModal
            boulder={uiModal.payload?.boulder}
            onClose={uiModal.back} // ⬅️ RETOUR fluide vers le bloc
          />
        )}


      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  gradeChip: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
    alignItems: 'center',
  },
  gradeChipSelected: {
    backgroundColor: '#357756',
  },
  gradeText: {
    color: '#E0E0E0',
    fontWeight: '600',
  },
  gradeTextSelected: {
    color: '#121212',
  },
  gradeCount: {
    fontSize: 11,
    color: '#B0B0B0',
  },
  gradeList: {
    marginVertical: 16,
  },
});
