import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Video } from 'expo-av';

export default function PlayVideoModal({ boulder, onClose }) {
  if (!boulder) return null;

  const videos = boulder.videos ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* HEADER */}
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: '#fff', marginBottom: 12, fontSize: 16 }}>
            ← Retour
          </Text>
        </TouchableOpacity>

        {/* CONTENT */}
        {videos.length === 0 ? (
          <Text style={{ color: '#aaa' }}>Aucune vidéo</Text>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={v => String(v.id)}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 24 }}>
                <Video
                  source={{ uri: item.url }}
                  style={{ width: '100%', height: 220 }}
                  useNativeControls
                  resizeMode="contain"
                />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
