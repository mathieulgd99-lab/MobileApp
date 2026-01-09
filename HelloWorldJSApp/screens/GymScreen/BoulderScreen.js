import React, { useState, useEffect, useContext } from 'react';
import { ScrollView,
        Text,
        FlatList,
        View,
        ActivityIndicator,
        TouchableOpacity,
        StyleSheet,
} from 'react-native';
import Svg, {Polygon } from 'react-native-svg';
import styles from '../styles';
import { getBoulders, getValidatedBoulders, createBoulderVideo,getBoulderVideos,deleteVideo } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

import useBoulders from '../Hooks/useBoulder';
import BlocksList from '../../components/BlockList';
import useComment from '../Hooks/useComment';
import useBoulderModal from '../Hooks/useBoulderModal';
import BoulderModal from '../../components/BoulderModal';
import CommentsModal from '../../components/CommentsModal';
import UploadVideoModal from '../../components/UploadVideoModal';
import PlayVideoModal from '../../components/PlayVideoModal';


//const API_BASE = "http://192.168.1.165:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;


export default function BoulderScreen() { 
  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const zones = [
    { label: 'Mur Coin', points: ' 40,300 20,300 20,400 80,400 60,380 40,380' },
    { label: 'Mur Dalle', points: '20,300 40,300 50,250 40,200 20,200'},
    { label: 'Mur Tension', points: '20,200 40,200 40,120 20,100'},
    { label: 'Mur Toit', points: '20,100 40,120 50,80 120,80 130,50 40,50'},
    { label: 'Mur Dynamique', points: '130,50 120,80 220,80 220,50'},
    { label: 'Mur Porte', points: '220,50 320,50 320,120, 295,120 295,80 220,80'},
    { label: 'Mur Devers', points: '295,120 320,120 320,230 295,230 295,210 280,190 295,160'},
    { label: 'Mur Diedre', points: '295,230 320,230 320,290 295,270'},
    { label: 'Mur Angle', points: '295,270 320,290 250,290 260,270'},
    { label :'Mur Angle 2', points: '250,290 250,310 255,320 295,320 295,325 320,325 320,300 260,300 260,290'},
    { label: 'Mur Easy', points: '295,325 320,325 320,400 250,400 250,380 295,380 '},
  ];

  const {user, token} = useContext(AuthContext);

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const [newComment, setNewComment] = useState('');

  const [uploadVideoVisible, setUploadVideoVisible] = useState(false);
  const [activeBoulder, setActiveBoulder] = useState(null);

  const modal = useBoulderModal();

  const [showVideos, setShowVideos] = useState(false);
  const [videos, setVideos] = useState([]);



  const {
    loading,
    error,
    validatedBoulders,
    boulders,
    grades,
    countGrade,
    toggleValidation,
    getFiltered,
    deleteBoulder,
    archiveBoulder,
    isValidated,
    countValidatedGrade
  } = useBoulders(token);

  const {
    comments,
    commentsModal,
    postingComment,
    openComments,
    closeComments,
    addNewComment,
    removeComment,
    getCommentCount,
    initCommentCounts,
  } = useComment(token);

  async function loadBoulders() {
    const result = await getBoulders();
    if (!result.error) {
      setBoulders(result.boulders);
    } else {
      console.log("Erreur getBoulders :", result.error);
    }
    const validated = await getValidatedBoulders(token);
    if (!validated.error) {
      setValidatedBoulders(validated.boulders);
    } else {
      console.log("Erreur loadBoulders getValidatedBoulders :", validated.error);
    }
    console.log("boulders : ",result.boulders)
    console.log("Validated: ",validated.boulders)
  }


  useEffect(() => {
    (async () => {
      console.log("loading")
      await loadBoulders();
      setLoading(false);
      console.log("loading 2")
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
          {countValidatedGrade(item.difficulty)}/{countGrade(item.difficulty)}
        </Text>
      </TouchableOpacity>
    );
  };


  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}
    style={{ backgroundColor: '#121212' }}>
        <Svg height="450" width="350" style={styles.map}>
          {zones.map((zone) => (
            <Polygon
              key={zone.label}
              points={zone.points}
              fill={selectedZone === zone.label ? '#8bc34a' : '#808080'}
              stroke="#fff"
              strokeWidth="1"
              onPressOut={() => handleClickZone(zone.label)}
            />
          ))}
        </Svg>
        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Boulders</Text>

          <FlatList
            data={grades}
            horizontal
            keyExtractor={(grade) => grade.id}
            renderItem={renderGrade}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.gradeList}
            extraData={selectedGrade}
          />
        </View>

        <BlocksList
          boulders={filteredBoulders}
          validatedBoulders={validatedBoulders}
          onPressImage={modal.open}
          onOpenComments={openComments}
          onToggleValidation={toggleValidation}
          getCommentCount={getCommentCount}
          imageBase={API_BASE}
          onDeleteBoulder={deleteBoulder}
          onArchiveBoulder={archiveBoulder}
          userRole={user.role}
        />

        <BoulderModal
          visible={modal.visible}
          boulder={modal.boulder}
          onClose={modal.close}
          imageBase={API_BASE}
          isValidated={isValidated(modal.boulder?.id)}
          onToggleValidation={toggleValidation}
          onOpenComments={openComments}
          commentCount={getCommentCount(modal.boulder?.id)}
          onUploadVideo={handleUploadVideo}
          onOpenVideos={(boulder) => openVideos(boulder.id)}
          isHistory={false}
        />

        <CommentsModal
          visible={commentsModal}
          comments={comments}
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          postingComment={postingComment}
          onAddComment={async () => {
            await addNewComment(newComment);
            setNewComment('');
          }}
          onRemoveComment={removeComment}
          onClose={closeComments}
        />

        <UploadVideoModal
          visible={uploadVideoVisible}
          onClose={handleCloseUploadVideo}
          onSubmit={handleSubmitVideo}
        />

        <PlayVideoModal
          visible={showVideos}
          onClose={() => setShowVideos(false)}
          videos={videos}
          onRemove={handleRemoveVideo}
        />

      </ScrollView>
    </View>
  );
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
  },
  image_zoomed: {
    width: "100%",
    height: "85%",
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
    backgroundColor: '#8bc34a',
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
  section: {
    marginTop: 16,
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  
  gradeList: {
    paddingHorizontal: 4,
  },
  
  
});
