import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';


export default function UploadVideoModal({
  visible,
  onClose,
  onSubmit,
}) {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  

  function reset() {
    setInstagramUrl('');
    setVideoFile(null);
    setLoading(false);
  }

  async function pickVideo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      setInstagramUrl('');
      setVideoFile(result.assets[0]);
    }
  }

  async function submit() {
    if (!instagramUrl && !videoFile) return;

    setLoading(true);

    if (instagramUrl) {
      await onSubmit({
        source: 'instagram',
        instagram_url: instagramUrl,
      });
    } else if (videoFile) {
      const formData = new FormData();

      formData.append('source', 'upload');
      formData.append('video', {
        uri: videoFile.uri,
        name: videoFile.fileName || 'video.mp4',
        type: videoFile.mimeType || 'video/mp4',
      });
      console.log("UploadVideoModal await onsubmit")
      await onSubmit(formData);
      console.log("UploadVideoModal await onsubmit")
    }

    reset();
    onClose();
  }

  const canSubmit = Boolean(instagramUrl || videoFile);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Ajouter une vidéo</Text>

          {/* Upload video */}
          <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
            <Text style={styles.uploadText}>
              {videoFile ? '🎬 Vidéo sélectionnée' : '📤 Choisir une vidéo'}
            </Text>
          </TouchableOpacity>
          {videoFile && (
            <View style={styles.previewContainer}>
              <Video
                source={{ uri: videoFile.uri }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                isLooping
              />
            </View>
          )}


          {/* Instagram link */}
          <TextInput
            style={styles.input}
            placeholder="Lien Instagram"
            placeholderTextColor="#999"
            value={instagramUrl}
            onChangeText={(text) => {
              setVideoFile(null);
              setInstagramUrl(text);
            }}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { opacity: canSubmit && !loading ? 1 : 0.5 },
            ]}
            disabled={!canSubmit || loading}
            onPress={submit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Envoyer</Text>
            )}
          </TouchableOpacity>
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
      width: '90%',
      backgroundColor: '#1e1e1e',
      borderRadius: 12,
      padding: 20,
    },
    close: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
    closeText: {
      color: '#fff',
      fontSize: 18,
    },
    title: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    uploadBtn: {
      backgroundColor: '#333',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    uploadText: {
      color: '#fff',
    },
    input: {
      backgroundColor: '#333',
      color: '#fff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
    },
    submitBtn: {
      backgroundColor: '#4CAF50',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    previewContainer: {
      width: '100%',
      height: 200,
      marginBottom: 15,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    video: {
      width: '100%',
      height: '100%',
    },
  });
  