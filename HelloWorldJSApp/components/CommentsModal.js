import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import styles from '../screens/styles';

export default function CommentsModal({
  visible,
  comments,
  user,
  newComment,
  setNewComment,
  postingComment,
  onAddComment,
  onRemoveComment,
  onClose,
  canPost = true,
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Commentaires</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#007AFF' }}>Fermer</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(c) => String(c.id)}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600' }}>{item.user_name}</Text>
                  <Text>{item.content}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{item.created_at}</Text>
                </View>

                {(user?.display_name === item.user_name || user?.role === 'admin') && (
                  <TouchableOpacity onPress={() => onRemoveComment(item.id)} style = {{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    backgroundColor: '#ff5252',
                    borderRadius: 6,
                  }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 12,
                    }}>Supprimer</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Aucun commentaire</Text>}
          />

        {canPost && (<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                style={{
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
                  }}
                multiline
              />
              <TouchableOpacity onPress={onAddComment} disabled={postingComment} 
                style={{
                    backgroundColor: '#007AFF',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8}}>
                <Text style={{ color: '#fff' }}>{postingComment ? '...' : 'Send'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>)
        }
        </View>
      </View>
    </Modal>
  );
}
