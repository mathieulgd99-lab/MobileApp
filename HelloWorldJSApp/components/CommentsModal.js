import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screens/styles';

export default function CommentsModal({
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 12 }}>
        
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Comments
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        {/* LISTE */}
        <FlatList
          data={comments}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>
                  {item.user_name}
                </Text>
                <Text>{item.content}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  {item.created_at}
                </Text>
              </View>

              {(user?.display_name === item.user_name ||
                user?.role === 'admin') && (
                <TouchableOpacity
                  onPress={() => onRemoveComment(item.id)}
                  style={{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    backgroundColor: '#ff5252',
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>
                    Supprimer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Aucun commentaire
            </Text>
          }
        />

        {/* INPUT */}
        {canPost && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginTop: 8,
              }}
            >
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                multiline
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
              />

                <TouchableOpacity
                  onPress={onAddComment}
                  disabled={postingComment || !newComment.trim()}
                  style={{
                    backgroundColor: postingComment ? '#aaa' : '#007AFF',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                  }}
                >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  {postingComment ? '...' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </SafeAreaView>
  );
}
