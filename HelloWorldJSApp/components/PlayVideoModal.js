import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function PlayVideoModal({
  videos = [],
  user,
  onClose,
  onRemove,
}) {
  const SCREEN_WIDTH = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, padding: 16 }}>
        {/* HEADER */}
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* CONTENT */}
        {videos.length === 0 ? (
          <Text style={{ color: '#aaa' }}>Aucune vidéo pour ce bloc</Text>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(v) => String(v.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const canDelete =
                user?.role === 'admin' ||
                user?.display_name === item.uploaded_by_name;

              return (
                <View
                  style={{
                    marginBottom: 32,
                    borderBottomWidth: 1,
                    borderBottomColor: '#222',
                    paddingBottom: 16,
                  }}
                >
                  {/* HEADER ROW */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 14 }}>
                      👤 {item.uploaded_by_name || 'Utilisateur inconnu'}
                    </Text>

                    {canDelete && (
                      <TouchableOpacity onPress={() => onRemove?.(item)}>
                        <Text style={{ color: '#ff5555' }}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* VIDEO / SOURCE */}
                  {item.source === 'upload' && item.video_url && (
                    <Video
                      source={{ uri: item.video_url }}
                      style={{ width: '100%', height: 220 }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping
                    />
                  )}

                  {item.source === 'instagram' && (
                    <View
                      style={{
                        backgroundColor: '#111',
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: '#fff', marginBottom: 4 }}>
                        Vidéo Instagram
                      </Text>
                      <Text style={{ color: '#aaa', fontSize: 12 }}>
                        {item.instagram_url}
                      </Text>
                    </View>
                  )}

                  {/* DESCRIPTION */}
                  {item.description && (
                    <Text
                      style={{
                        color: '#ccc',
                        marginTop: 8,
                        fontSize: 13,
                      }}
                    >
                      {item.description}
                    </Text>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
