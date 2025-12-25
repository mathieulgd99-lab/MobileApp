import React, { useState, useEffect, useContext } from 'react';
import { ScrollView,
        Text,
        Modal,
        Image,
        FlatList,
        View,
        ActivityIndicator,
        TouchableOpacity,
        Alert,
        StyleSheet,
        SafeAreaView,
        KeyboardAvoidingView,
        Platform,
        TextInput
} from 'react-native';
import Svg, {Polygon } from 'react-native-svg';
import styles from '../styles';
import { getBoulders, getValidatedBoulders } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

import useBoulders from '../Hooks/useBoulder';
import BlocksList from '../../components/BlockList';
import useComment from '../Hooks/useComment';

const API_BASE = "http://192.168.190.72:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES

export default function BoulderScreen() { 
  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const zones = [
    { id: 'murC', points: ' 40,300 20,300 20,400 80,400 60,380 40,380', label: 'Mur ouest' },
    { id: 'murDalle', points: '20,300 40,300 50,250 40,200 20,200', label: 'Mur O-milieu' },
    { id: 'murTension', points: '20,200 40,200 40,120 20,100', label: 'Mur O-haut' },
    { id: 'murToit', points: '20,100 40,120 50,80 120,80 130,50 40,50', label: 'Mur N-O' },
    { id: 'murDynamique', points: '130,50 120,80 220,80 220,50', label: 'Mur N-milieu' },
    { id: 'murPorte', points: '220,50 320,50 320,120, 295,120 295,80 220,80', label: 'Mur N-E' },
    { id: 'murDevers', points: '295,120 320,120 320,230 295,230 295,210 280,190 295,160', label: 'Mur E' },
    { id: 'murDiedre', points: '295,230 320,230 320,290 295,270', label: 'Mur E-milieu' },
    { id: 'murAngle', points: '295,270 320,290 250,290 260,270', label: 'Mur E-bas' },
    { id :'murAngle2', points: '250,290 250,310 255,320 295,320 295,325 320,325 320,300 260,300 260,290' , label: 'Mur central' },
    { id: 'murEasy', points: '295,325 320,325 320,400 250,400 250,380 295,380 ', label: 'Mur sud' },
  ];

  const {user, token} = useContext(AuthContext);

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false)
  const [newComment, setNewComment] = useState('');

  const {
    loading,
    error,
    validatedBoulders,
    boulders,
    grades,
    toggleValidation,
    getFiltered,
    deleteBoulder,
    archiveBoulder
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
      console.log("Erreur getValidatedBoulders :", validated.error);
    }
  }


  useEffect(() => {
    (async () => {
      await loadBoulders();
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
    archived: true,
  });

  function countGrade(difficulty) {
    let res = 0;
    boulders.forEach((image) => {
      if (image.grade === difficulty) {
        res++
      }
    })
    return res
  }

  function handleCloseModal() {
    setShowImage(false);
    setSelectedImage(null);
  }

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const handleClickZone = (zoneId) => {
    setSelectedZone(prev => prev === zoneId ? null : zoneId);
  };

  const handleClickImage = (image) => {
    setSelectedImage(image);
    setShowImage(true);
  };
  
  const renderGrade =  ({item}) => {
    const isSelected = selectedGrade === item.difficulty;
    const backColor = isSelected ? '#8bc34a' : '#808080'

    return (
      <TouchableOpacity
      onPress={() => handleClickGrade(item.difficulty)}
      >
        <Text style={[styles.grade, { backgroundColor: backColor }]}> {item.difficulty}  0/{countGrade(item.difficulty)}</Text>
      </TouchableOpacity>
    )
  }


  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Svg height="500" width="350" style={styles.map}>
          {zones.map((zone) => (
            <Polygon
              key={zone.id}
              points={zone.points}
              fill={selectedZone === zone.id ? '#8bc34a' : '#808080'}
              stroke="#fff"
              strokeWidth="1"
              onPressOut={() => handleClickZone(zone.id)}
            />
          ))}
        </Svg>

        <View style={styles.container}>
          <Text style={styles.text}>Boulders</Text>
        </View>

        <FlatList
          data={grades}
          horizontal
          keyExtractor={(grade) => grade.id}
          renderItem={renderGrade}
          scrollEnabled={true}
          extraData={selectedGrade}
        />

        <BlocksList
          boulders={filteredBoulders}
          validatedBoulders={validatedBoulders}
          onPressImage={handleClickImage}
          onOpenComments={openComments}
          onToggleValidation={toggleValidation}
          getCommentCount={getCommentCount}
          imageBase={API_BASE}
          onDeleteBoulder={deleteBoulder}
          onArchiveBoulder={archiveBoulder}
          userRole={user.role}
        />
        {/* Image full-screen modal */}
        {showImage && selectedImage && (
          <Modal visible={showImage} onRequestClose={handleCloseModal} animationType="fade">
            <View style={{ flex: 1, backgroundColor: '#000' }}>
              <View style={styles.header}>
                <Text style={styles.header_grade}>{selectedImage.grade}</Text>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: `${API_BASE}/${selectedImage.path}` }} style={styles.image_zoomed} />
                {/* Bouton commentaires en bas gauche de l'image */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openComments(selectedImage.id)}
                    style={localStyles.commentButton}
                  >
                  <Text style={localStyles.commentBubble}>💬</Text>
                  <View style={localStyles.commentCountBox}>
                    <Text style={localStyles.commentCountText}>{getCommentCount(selectedImage.id)}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => toggleValidation(selectedImage)}
                style={[
                  styles.validationButton,
                  { backgroundColor: validatedBoulders.some(b => b.id === selectedImage.id) ? '#4CAF50' : '#BDBDBD'}
                ]}
                >
                <Text style={styles.validationIcon}>✓</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.footer, { backgroundColor: selectedImage?.color || '#000' }]}>
                <Text style={styles.footerText}>Ouvert depuis :</Text>
                <Text style={styles.footerText}>Points :</Text>
                <Text style={styles.footerText}>Tops :</Text>

                <TouchableOpacity onPress={handleCloseModal} style={[styles.footerButton]}>
                  <Text style={[styles.footerButtonText]}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Comments Modal */}
        <Modal visible={commentsModal} animationType="slide" onRequestClose={closeComments}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Commentaires</Text>
                <TouchableOpacity onPress={() => closeComments()}>
                  <Text style={{ color: '#007AFF' }}>Fermer</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  data={comments}
                  keyExtractor={(c) => String(c.id)}
                  renderItem={({ item }) => (
                    <View style={localStyles.commentRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600' }}>{item.user_name}</Text>
                        <Text style={{ marginTop: 4 }}>{item.content}</Text>
                        <Text style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{item.created_at}</Text>
                      </View>
                      { (user?.display_name === item.user_name || user?.role === 'admin') && (
                        <TouchableOpacity onPress={() => removeComment(item.id)} style={localStyles.deleteButton}>
                          <Text style={localStyles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 12 }}>Aucun commentaire</Text>}
                />
              </View>

              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a new comment..."
                    style={localStyles.input}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      await addNewComment(newComment);
                      setNewComment('');
                    }}
                    style={localStyles.sendButton}
                    disabled={postingComment}>
                    <Text style={{ color: '#fff' }}>{postingComment ? '...' : 'Send'}</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  commentButton: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  commentBubble: {
    fontSize: 20,
    marginRight: 6,
  },
  commentCountBox: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
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
});
