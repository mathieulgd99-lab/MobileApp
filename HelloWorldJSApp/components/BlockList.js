import React, {useState} from 'react';
import { FlatList, View, TouchableOpacity, Image, StyleSheet, Text, Alert } from 'react-native';
import styles from '../screens/styles';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';



export default function BlocksList({
    boulders,
    setBoulders,
    validatedBoulders = [],
    onPressImage,
    onOpenComments,
    onToggleValidation,
    getCommentCount,
    imageBase,
    numColumns = 2,
    columnWrapperStyle,
    onDeleteBoulder,
    onArchiveBoulder,
    userRole,
  }) {
  
  const [menuOpenForId, setMenuOpenForId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const renderBoulder = ({ item }) => {
    const commentCount = getCommentCount ? getCommentCount(item.id) : 0;
  
    const openMenu = (item) => {
      setMenuOpenForId((prev) => (prev === item.id ? null : item.id));
    };
    
    const closeMenu = () => {
      setMenuOpenForId(null);
    };


  const confirmAction = (type, item) => {
    const actionText = type === 'delete' ? 'delete' : 'archive/unarchive';
  
    Alert.alert(
      'Confirm action',
      `Are you sure you want to ${actionText} this boulder?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: closeMenu },
        {
          text: actionText.toUpperCase(),
          style: type === 'delete' ? 'destructive' : 'default',
          onPress: async () => {
            closeMenu();
            if (type === 'delete') {
              onDeleteBoulder(item);
            } else {
              const res = await onArchiveBoulder(item);

              if (res?.boulder) {
                setBoulders(prev =>
                  prev.map(b => b.id === res.boulder.id ? { ...b, ...res.boulder } : b)
                );

                if (res.archived) {
                  setValidatedBoulders(prev =>
                    prev.filter(v => v.id !== res.boulder.id)
                  );
                }
              }

              setSnackbarText(
                res?.archived
                  ? '🟢 Boulder archived successfully'
                  : '🔵 Boulder unarchived successfully'
              );
              setSnackbarVisible(true);
            }
          },
        },
      ]
    );
    };    
  
  
    return (
    <View>
        <View style={localStyles.imageContainer}>
            <TouchableOpacity onPress={() => onPressImage(item)}>
                <Image
                source={{ uri: `${imageBase}/${item.path}` }}
                style={[
                    styles.image,
                    {borderColor: item.color}]}
                />
            </TouchableOpacity>
            {/* Bouton en haut a droite pour delete / archive un bloc */}
            {userRole === 'admin' && (
              <TouchableOpacity
              onPress={() => openMenu(item)}
              style={localStyles.menuButton}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical-outline" size={20} color="#fff" />
            </TouchableOpacity>
            )}
            {userRole === 'admin' && menuOpenForId === item.id && (
              <View style={localStyles.menu}>
                <TouchableOpacity
                  style={localStyles.menuItem}
                  onPress={() => confirmAction('archive', item)}
                >
                  <Text style={localStyles.menuText}>Archive</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={localStyles.menuItem}
                  onPress={() => confirmAction('delete', item)}
                >
                  <Text style={[localStyles.menuText, { color: 'red' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onOpenComments(item.id)}
                style={localStyles.commentButton}
                >
                <Text style={localStyles.commentBubble}>💬</Text>
                <View style={localStyles.commentCountBox}>
                    <Text style={localStyles.commentCountText}>{commentCount}</Text>
                </View>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => onToggleValidation(item)}
                style={[
                styles.validationButton,
                { backgroundColor: validatedBoulders.some(b => b.id === item.id) ? '#4CAF50' : '#BDBDBD'}
                ]}
                >
                <Text style={styles.validationIcon}>✓</Text>
                </TouchableOpacity>
                <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{ backgroundColor: '#4CAF50' }}
                >
                {snackbarText}
                </Snackbar>
        </View>
    </View>
  );
};

  return (
    <FlatList
      data={boulders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderBoulder}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      scrollEnabled={false}
    />
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
    imageContainer: {
        position: 'relative',
        right: 6
    },
    menuButton: {
      position: 'absolute',
      top: 28,
      right: 18,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 16,
      padding: 6,
      zIndex: 10,
    },
    menu: {
      position: 'absolute',
      top: 32,
      right: 6,
      backgroundColor: '#222',
      borderRadius: 6,
      paddingVertical: 4,
      zIndex: 30,
      elevation: 5,
    },
  
    menuItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
  
    menuText: {
      color: '#fff',
      fontSize: 14,
    },

  });
  