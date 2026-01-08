import React from 'react';
import { Modal, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../screens/styles';
import { Ionicons } from '@expo/vector-icons';

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
  
  const daysSince = (dateString) => {
    if (!dateString) return null;
    const start = new Date(dateString);
    const now = new Date();
    const diffMs = now - start;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };

  const openedDays = daysSince(boulder.added_at);
  const validations = boulder.validations_count ?? 0;
  const points = boulder.current_point ?? 0;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>

        {/* TOP BAR */}
        <View style={localStyles.topBar}>
          <Text style={localStyles.zoneTitle}>
            {boulder.zone_id}
          </Text>

          <View style={localStyles.tagRow}>
            {/* Color tag */}
            <View style={localStyles.tag}>
              <View
                style={[
                  localStyles.colorDot,
                  { backgroundColor: boulder.color || '#999' },
                ]}
              />
              <Text style={localStyles.tagText}>
                {boulder.color}
              </Text>
            </View>

            {/* Difficulty tag */}
            <View style={localStyles.tag}>
              <Text style={localStyles.tagText}>
                Grade {boulder.grade}
              </Text>
            </View>
          </View>
          {/* META TAGS */}
          <View style={localStyles.metaRow}>
            {/* Wall type */}
            <View style={localStyles.tag}>
              <Text style={localStyles.tagText}>
                {boulder.wall_type}
              </Text>
            </View>

            {/* Skills */}
            {boulder.skills?.map((skill) => (
              <View key={skill} style={localStyles.tag}>
                <Text style={localStyles.tagText}>
                  ⚡ {skill}
                </Text>
              </View>
            ))}

            {/* Holds */}
            {boulder.holds?.map((hold) => (
              <View key={hold} style={localStyles.tag}>
                <Text style={localStyles.tagText}>
                  ✋ {hold}
                </Text>
              </View>
            ))}
          </View>

        </View>


        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent
        >
          <Image
            source={{ uri: `${imageBase}/${boulder.path}` }}
            style={localStyles.imageZoomable}
          />
        </ScrollView>

        {/* Comments */}
        <TouchableOpacity
          onPress={() => onOpenComments(boulder.id)}
          style={styles.commentButton}
        >
          <Text style={styles.commentBubble}>💬</Text>
          <View style={styles.commentCountBox}>
            <Text style={styles.commentCountText}>{commentCount}</Text>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={localStyles.actionColumn}>
          {!isHistory && (
            <TouchableOpacity
              style={localStyles.roundButton}
              onPress={() => onUploadVideo?.(boulder)}
            >
              <Ionicons name="videocam-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={localStyles.roundButton}
            onPress={() => onOpenVideos?.(boulder)}
          >
            <Ionicons name="play-outline" size={22} color="#fff" />
          </TouchableOpacity>

          {canValidate && (
            <TouchableOpacity
              onPress={() => onToggleValidation(boulder)}
              style={[
                localStyles.roundButton,
                { backgroundColor: isValidated ? '#4CAF50' : '#555' },
              ]}
            >
              <Text style={styles.validationIcon}>✓</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      <View style={localStyles.footer}>
        <Text style={localStyles.footerText}>
          ✅ {validations} validation{validations > 1 ? 's' : ''}
        </Text>

        <Text style={localStyles.footerText}>
          ⭐ {points} pts
        </Text>

        {openedDays !== null && !isHistory && (
          <Text style={localStyles.footerText}>
            🕒 Open since {openedDays} day{openedDays > 1 ? 's' : ''}
          </Text>
        )}

        <TouchableOpacity onPress={onClose} style={localStyles.closeButton}>
          <Text style={localStyles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const localStyles = {
  imageContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  
  imageZoomable: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // ⬅️ plus de bandes noires
  },

  difficultyBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  actionColumn: {
    position: 'absolute',
    right: 20,
    bottom: 20, // ⬅️ plus bas qu’avant
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

  footer: {
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#eee',
    fontSize: 13,
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  topBar: {
    backgroundColor: '#000',
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  
  zoneTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  
  tagRow: {
    flexDirection: 'row',
  },
  
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
    marginRight: 4,
  },
  
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  
};
