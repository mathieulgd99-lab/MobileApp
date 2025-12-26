import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  ScrollView
} from 'react-native';
import styles from '../styles';
import { getValidatedBoulders } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
import useBoulders from '../Hooks/useBoulder';
import BlocksList from '../../components/BlockList';
import useComment from '../Hooks/useComment';
const API_BASE = "http://192.168.1.69:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES


export default function HistoryScreen() {
  const {user, token} = useContext(AuthContext);

  const [showAll, setShowAll] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false)

  const {
    loading,
    error,
    boulders,
    validatedBoulders,
    grades,
    deleteBoulder,
    archiveBoulder,
    getFiltered,
    countGrade
  } = useBoulders(token);

  const {
    comments,
    commentsModal,
    openComments,
    closeComments,
    removeComment,
    getCommentCount,
    initCommentCounts,
  } = useComment(token);

  async function loadBoulders() {
    const validated = await getValidatedBoulders(token);
    if (!validated.error) {
      setValidatedBoulders(validated.boulders);
    } else {
      console.log("Erreur getValidatedBoulders :", validated.error);
    }
  }

  const filteredBoulders = getFiltered({
    ...(showAll ? {} : { archived: false }),  });

  function archivedFilter() {
    setShowAll(prev => !prev)
  }

  useEffect(() => {
    (async () => {
      await loadBoulders();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (validatedBoulders.length > 0) {
      initCommentCounts(validatedBoulders);
    }
  }, [validatedBoulders]);

  const handleClickImage = (image) => {
    setSelectedImage(image);
    setShowImage(true);
  };

  function handleCloseModal() {
    setShowImage(false);
    setSelectedImage(null);
  }

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const renderGrade =  ({item}) => {
    const isSelected = selectedGrade === item.difficulty;
    const backColor = isSelected ? '#8bc34a' : '#808080'
    const count = countGrade(item.difficulty)
    return (
      <TouchableOpacity
      onPress={() => handleClickGrade(item.difficulty)}
      >
        <Text style={[styles.grade, { backgroundColor: backColor }]}> {item.difficulty}  {count}/{count}</Text>
      </TouchableOpacity>
    )
  }

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
    
    <FlatList
        data={grades}
        horizontal
        keyExtractor={(grade) => grade.id}
        renderItem={renderGrade}
        scrollEnabled={true}
        extraData={selectedGrade}
    />
    <ScrollView>
    <BlocksList
          boulders={filteredBoulders}
          validatedBoulders={validatedBoulders}
          onPressImage={handleClickImage}
          onOpenComments={openComments}
          getCommentCount={getCommentCount}
          onToggleValidation={() => {}}
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
            <View style={[
              localStyles.validationButton,
            ]}>
            <Text style={localStyles.validationIcon}>✓</Text>
            </View>
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
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </View>
  )
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
    backgroundColor: '#BDBDBD',
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
});