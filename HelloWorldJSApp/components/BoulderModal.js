import React from 'react';
import { Modal, View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../screens/styles';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function BoulderModal({
  visible,
  boulder,
  onClose,
  imageBase,
  isValidated,
  onToggleValidation,
  onOpenComments,
  commentCount,
  canValidate = true,
  onUploadVideo,
  onOpenVideos,
  isHistory,
}) {

  if (!boulder) return null;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={styles.header}>
          <Text style={styles.header_grade}>{boulder.grade}</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `${imageBase}/${boulder.path}` }}
            style={styles.image_zoomed}
          />

          <TouchableOpacity
            onPress={() => onOpenComments(boulder.id)}
            style={styles.commentButton}
          >
            <Text style={styles.commentBubble}>💬</Text>
            <View style={styles.commentCountBox}>
              <Text style={styles.commentCountText}>{commentCount}</Text>
            </View>
          </TouchableOpacity>

        {/* -------- ACTION BUTTONS (RIGHT SIDE) -------- */}
        <View style={localStyles.actionColumn}>
        
        {/* Upload video */}
        {!isHistory && <TouchableOpacity
            style={localStyles.roundButton}
            onPress={() => onUploadVideo?.(boulder)}
        >
            <Ionicons name="videocam-outline" size={22} color="#fff" />
        </TouchableOpacity>}

        {/* View videos */}
        <TouchableOpacity
            style={localStyles.roundButton}
            onPress={() => onOpenVideos?.(boulder)}
        >
            <Ionicons name="play-outline" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Validate */}
        {canValidate && (
            <TouchableOpacity
            onPress={() => onToggleValidation(boulder)}
            style={[
                localStyles.roundButton,
                { backgroundColor: isValidated ? '#4CAF50' : '#BDBDBD' },
            ]}
            >
            <Text style={styles.validationIcon}>✓</Text>
            </TouchableOpacity>
        )}
        </View>
        </View>

        <View style={[styles.footer, { backgroundColor: boulder.color || '#000' }]}>
          <TouchableOpacity onPress={onClose} style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = {
    actionColumn: {
      position: 'absolute',
      right: 20,
      bottom: 28,
      alignItems: 'center',
    },
    roundButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
  };
  