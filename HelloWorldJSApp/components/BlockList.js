import React from 'react';
import { FlatList, View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import styles from '../screens/styles';

export default function BlocksList({
    boulders,
    validatedBoulders = [],
    onPressImage,
    onOpenComments,
    onToggleValidation,
    getCommentCount,
    imageBase,
    numColumns = 2,
    columnWrapperStyle,
  }) {
  const isValidated = (id) =>
    validatedBoulders.some((b) => b.id === id);

  const renderBoulder = ({ item }) => {
    const commentCount = getCommentCount ? getCommentCount(item.id) : 0;
  
    return (
    <View style={styles.item}>
        <View style={localStyles.imageContainer}>
            <TouchableOpacity onPress={() => onPressImage(item)}>
                <Image
                source={{ uri: `${imageBase}/${item.path}` }}
                style={[
                    styles.image,
                    {borderColor: item.color}]}
                />
            </TouchableOpacity>
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
    }
  });
  