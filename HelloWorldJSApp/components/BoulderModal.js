// components/BoulderModal.js
import React from 'react';
import { Modal, View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../screens/styles';

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

          {canValidate && (<TouchableOpacity
            onPress={() => onToggleValidation(boulder)}
            style={[
              styles.validationButton,
              { backgroundColor: isValidated ? '#4CAF50' : '#BDBDBD' },
            ]}
          >
            <Text style={styles.validationIcon}>✓</Text>
          </TouchableOpacity>
          )}
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


