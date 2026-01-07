import React, {useContext} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function PlayVideoModal({
  visible,
  onClose,
  videos = [],
  onRemove
}) {
  const { user } = useContext(AuthContext);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          {/* Close button */}
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Vidéos du bloc</Text>

          {/* Videos list */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {videos.length === 0 && (
              <Text style={styles.emptyText}>
                Aucune vidéo pour ce bloc
              </Text>
            )}

            {videos.map((video) => (
              <View key={video.id} style={styles.videoCard}>
                <View style={styles.headerRow}>
                {/* User name */}
                <Text style={styles.username}>
                  👤 {video.uploaded_by_name || 'Utilisateur inconnu'}
                </Text>

                {(user?.role === 'admin' ||
                  user?.display_name === video.uploaded_by_name) && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onRemove(video)}
                  >
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                )}
                </View>

                {/* Video */}
                {video.source === 'upload' && video.video_url && (
                  <Video
                    source={{ uri: video.video_url }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                  />
                )}

                {/* Instagram fallback */}
                {video.source === 'instagram' && (
                  <View style={styles.instagramBox}>
                    <Text style={styles.instagramText}>
                      Vidéo Instagram
                    </Text>
                    <Text style={styles.instagramUrl}>
                      {video.instagram_url}
                    </Text>
                  </View>
                )}

                {/* Description */}
                {video.description && (
                  <Text style={styles.description}>
                    {video.description}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      width: '95%',
      height: '85%',
      backgroundColor: '#1e1e1e',
      borderRadius: 12,
      padding: 16,
    },
    close: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
    },
    closeText: {
      color: '#fff',
      fontSize: 20,
    },
    title: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    emptyText: {
      color: '#aaa',
      textAlign: 'center',
      marginTop: 30,
    },
    videoCard: {
      marginBottom: 20,
      backgroundColor: '#2a2a2a',
      borderRadius: 10,
      padding: 12,
    },
    username: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 8,
    },
    video: {
      width: width * 0.85,
      height: 220,
      backgroundColor: '#000',
      borderRadius: 8,
      alignSelf: 'center',
    },
    description: {
      color: '#ddd',
      marginTop: 8,
      fontSize: 13,
    },
    instagramBox: {
      backgroundColor: '#333',
      padding: 12,
      borderRadius: 8,
    },
    instagramText: {
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 4,
    },
    instagramUrl: {
      color: '#aaa',
      fontSize: 12,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    
    deleteButton: {
      backgroundColor: '#c62828',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    
    deleteButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    
  });