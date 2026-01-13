import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import styles from '../styles';
import { AuthContext } from '../../context/AuthContext';
import useBoulders from '../Hooks/useBoulder';
import useComment from '../Hooks/useComment';
import useBoulderModal from '../Hooks/useBoulderModal';

import BlocksList from '../../components/BlockList';
import BoulderModal from '../../components/BoulderModal';
import CommentsModal from '../../components/CommentsModal';

//const API_BASE = "http://192.168.1.165:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;


export default function HistoryScreen({ profileUser, token: tokenProp }) {
  const { token: tokenFromCtx, user } = useContext(AuthContext);
  const authToken = tokenProp || tokenFromCtx;

  const [showAll, setShowAll] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);


  const imageModal = useBoulderModal();

  const {
    loading,
    error,
    validatedBoulders,
    grades,
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
  

  const archivedFilter = () => setShowAll(prev => !prev);

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
          onPressImage={(boulder) => imageModal.open(boulder)}
          onOpenComments={openComments}
          getCommentCount={getCommentCount}
          onToggleValidation={() => {}}
          imageBase={API_BASE}
          onDeleteBoulder={deleteBoulder}
          onArchiveBoulder={archiveBoulder}
          userRole={user.role}
        />
    {/* -------- IMAGE MODAL -------- */}
    <BoulderModal
        visible={imageModal.visible}
        boulder={imageModal.boulder}
        onClose={imageModal.close}
        imageBase={API_BASE}
        isValidated={isValidated(imageModal.boulder?.id)}
        onToggleValidation={() => {}}
        onOpenComments={openComments}
        commentCount={getCommentCount(imageModal.boulder?.id)}
        canValidate={false}
        isHistory={true}
      />

      {/* -------- COMMENTS MODAL -------- */}
      <CommentsModal
        visible={commentsModal}
        comments={comments}
        user={user}
        onRemoveComment={removeComment}
        onClose={closeComments}
        canPost={false} 
      />
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