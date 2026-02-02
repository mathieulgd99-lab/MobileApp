import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getEvents,deleteEvent } from '../../api/auth';
import colors from '../colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
//const API_BASE = "http://192.168.1.165:3000";


const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_GAP = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - ITEM_GAP * 3) / 2;

export default function EventScreen() {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  // ➕ modal state
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await getEvents(token);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setEvents(res.events || []);
    setLoading(false);
  };

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];

    events.forEach((event) => {
      const endDate = new Date(event.end_date);
      if (endDate >= now) upcoming.push(event);
      else past.push(event);
    });

    upcoming.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
    past.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const renderEvent = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => setSelectedEvent(item)}
      >
        <View style={styles.imageWrapper}>
          {item.server_filename ? (
            <Image
              source={{ uri: `${API_BASE}/uploads/${item.server_filename}` }}
              style={styles.image}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}

          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {new Date(item.start_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleDeleteEvent = async (eventId) => {
    Alert.alert(
      'Delete event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteEvent(eventId, token);
  
            if (res?.error) {
              Alert.alert('Error', 'Failed to delete event');
              return;
            }
  
            // Remove event from state
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
  
            // Close modal
            setSelectedEvent(null);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load events</Text>
      </View>
    );
  }



  return (
    <>
      <FlatList
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: ITEM_GAP,
          backgroundColor: colors.background,
        }}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Upcoming events</Text>
        }
        data={upcomingEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: ITEM_GAP }}
        extraData={events}
        ListFooterComponent={
          pastEvents.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Past events
              </Text>
              <FlatList
                data={pastEvents}
                renderItem={renderEvent}
                keyExtractor={(item) => `past-${item.id}`}
                numColumns={2}
                columnWrapperStyle={{ gap: ITEM_GAP }}
                scrollEnabled={false}
                extraData={events}
              />
            </>
          ) : null
        }
      />

      {/* 🔥 MODAL EVENT */}
      <Modal
        visible={!!selectedEvent}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <View style={styles.modalContainer}>
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                { paddingTop: insets.top + 8 },
              ]}
            >
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

              <TouchableOpacity
                onPress={() => setSelectedEvent(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* 🔴 ADMIN ONLY DELETE BUTTON */}
            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteEvent(selectedEvent.id)}
              >
                <Text style={styles.deleteButtonText}>Remove event</Text>
              </TouchableOpacity>
            )}

            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedEvent.server_filename && (
                <Image
                  source={{
                    uri: `${API_BASE}/uploads/${selectedEvent.server_filename}`,
                  }}
                  style={styles.modalImage}
                />
              )}

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Informations :</Text>

                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>Start date: </Text>
                  {new Date(selectedEvent.start_date).toLocaleDateString()}
                </Text>

                <Text style={styles.infoText}>
                  <Text style={styles.infoLabel}>End date: </Text>
                  {new Date(selectedEvent.end_date).toLocaleDateString()}
                </Text>

                <Text style={styles.infoTitle}>Description :</Text>
                <Text style={[styles.infoText, { marginTop: 8 }]}>
                  {selectedEvent.description}
                </Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: 'white',
  },
  card: {
    width: ITEM_WIDTH,
    marginBottom: ITEM_GAP,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: ITEM_WIDTH,
  },
  imagePlaceholder: {
    width: '100%',
    height: ITEM_WIDTH,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#777',
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    color: 'white',
    fontSize: 12,
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },

  /* MODAL */
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 22,
  },
  modalContent: {
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoSection: {
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: '500',
  },
  deleteButton: {
    margin: 16,
    paddingVertical: 12,
    backgroundColor: '#d9534f',
    borderRadius: 8,
    alignItems: 'center',
  },
  
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
