import React from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import styles from '../screens/styles';
import { Ionicons } from '@expo/vector-icons';

export default function BoulderModal({
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

  const safeCommentCount =
    typeof commentCount === 'number' ? commentCount : 0;

  const daysSince = (dateString) => {
    if (!dateString) return null;
    const start = new Date(dateString);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  };

  const openedDays = daysSince(boulder.added_at);
  const validations = boulder.validations_count ?? 0;
  const points = boulder.current_point ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* TOP BAR */}
      <View style={localStyles.topBar}>
        <Text style={localStyles.zoneTitle}>{boulder.zone_id}</Text>

        <View style={localStyles.tagRow}>
          <View style={localStyles.tag}>
            <View
              style={[
                localStyles.colorDot,
                { backgroundColor: boulder.color || '#999' },
              ]}
            />
            <Text style={localStyles.tagText}>{boulder.color}</Text>
          </View>

          <View style={localStyles.tag}>
            <Text style={localStyles.tagText}>Grade {boulder.grade}</Text>
          </View>
        </View>

        <View style={localStyles.metaRow}>
          <View style={localStyles.tag}>
            <Text style={localStyles.tagText}>{boulder.wall_type}</Text>
          </View>

          {boulder.skills?.map((skill) => (
            <View key={skill} style={localStyles.tag}>
              <Text style={localStyles.tagText}>⚡ {skill}</Text>
            </View>
          ))}

          {boulder.holds?.map((hold) => (
            <View key={hold} style={localStyles.tag}>
              <Text style={localStyles.tagText}>✋ {hold}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* IMAGE */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        maximumZoomScale={3}
        minimumZoomScale={1}
        centerContent
      >
        <Image
          source={{ uri: `${imageBase}/${boulder.path}` }}
          style={localStyles.imageZoomable}
        />
      </ScrollView>

      <TouchableOpacity onPress={onClose} style={localStyles.closeButton}>
        <Text style={localStyles.closeButtonText}>Close</Text>
      </TouchableOpacity>

      {/* COMMENTS */}
      <TouchableOpacity
        onPress={() => onOpenComments?.(boulder.id)}
        style={[styles.commentButton, localStyles.commentButtonFix]}
      >

        <Text style={styles.commentBubble}>💬</Text>
        <View style={styles.commentCountBox}>
          <Text style={styles.commentCountText}>{safeCommentCount}</Text>
        </View>
      </TouchableOpacity>

      {/* ACTIONS */}
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
            onPress={() => onToggleValidation?.(boulder)}
            style={[
              localStyles.roundButton,
              { backgroundColor: isValidated ? '#4CAF50' : '#555' },
            ]}
          >
            <Text style={styles.validationIcon}>✓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FOOTER */}
      <View style={localStyles.footer}>
        <Text style={localStyles.footerText}>
          ✅ {validations} validation{validations > 1 ? 's' : ''}
        </Text>

        <Text style={localStyles.footerText}>⭐ {points} pts</Text>

        {openedDays !== null && !isHistory && (
          <Text style={localStyles.footerText}>
            🕒 Open since {openedDays} day{openedDays > 1 ? 's' : ''}
          </Text>
        )}

        
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  imageZoomable: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position : 'relative'
  },

  actionColumn: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    alignItems: 'center',
    zIndex: 20,
    elevation: 20, // ANDROID FIX
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
    zIndex: 1,
  },

  footerText: {
    color: '#eee',
    fontSize: 13,
    marginBottom: 4,
  },

  closeButton: {
    position: 'absolute',
    top: 140,
    right: 12,
    zIndex: 10,

    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
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

  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  commentButtonFix: {
    position: 'absolute',
    left: 16,
    bottom: 102,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    //bottom: 140,
    //left: 30,
    zIndex: 40,
    elevation: 30, // Android
},

});

