import React, { useContext, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import styles from '../styles';
import colors from '../colors';
import { createEvent } from '../../api/auth';

// Helper to infer mime type from filename extension (simple mapping)
const getMimeTypeFromFilename = (filename) => {
  if (!filename) return 'application/octet-stream';
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

export default function AddEvent() {
  const { user, token } = useContext(AuthContext);

  const [eventImage, setEventImage] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  const [startDate, setStartDate] = useState(null); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- DATE SELECTION ---------------- */
  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      // Nouvelle sélection
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      // Sélection de fin
      if (day.dateString < startDate) {
        setEndDate(startDate);
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    if (!startDate) return {};

    // 🔵 Un seul jour → rond
    if (!endDate || startDate === endDate) {
      return {
        [startDate]: {
          selected: true,
          selectedColor: colors.primary,
          selectedTextColor: '#fff',
        },
      };
    }

    const marked = {};

    let current = new Date(startDate);
    const last = new Date(endDate);

    while (current <= last) {
      const dateString = current.toISOString().split('T')[0];

      marked[dateString] = {
        color: colors.primary,
        textColor: '#fff',
      };

      current.setDate(current.getDate() + 1);
    }

    // Début de période
    marked[startDate] = {
      startingDay: true,
      color: colors.primary,
      textColor: '#fff',
    };

    // Fin de période
    marked[endDate] = {
      endingDay: true,
      color: colors.primary,
      textColor: '#fff',
    };

    return marked;
  };

  /* ---------------- IMAGE ---------------- */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refused', 'Gallery access is required.');
      return;
    }
    console.log("here")
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    console.log("here1")
    if (!result.canceled) {
      console.log("here2")
      setEventImage(result.assets[0].uri);
    }
  };

  /* ---------------- PUBLISH ---------------- */
  const handlePublish = async () => {
    // basic validation
    if (!title || !startDate || !endDate || !description) {
      Alert.alert('Missing fields', 'Please add a title and description and select start & end dates.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // champs texte
      formData.append('title', title);
      formData.append('description', description);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
    
      if (eventImage) {
        const uriWithoutQuery = eventImage.split('?')[0];
        const filename = uriWithoutQuery.split('/').pop();
        const mimeType = getMimeTypeFromFilename(filename);
    
        formData.append('event', {
          uri: eventImage,
          name: filename,
          type: mimeType,
        });
      }

      const res = await createEvent(formData, token);

      if (res && res.error) {
        console.error('Create event error:', res.error);
        Alert.alert('Error', res.error?.message || JSON.stringify(res.error));
        setIsLoading(false);
        return;
      }

      // success
      Alert.alert('Event published!', 'The event has been successfully created.');

      // reset form
      setTitle('');
      setDescription('');
      setEventImage(null);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error('Publish failed:', err);
      Alert.alert('Error', 'Failed to create event.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.event_container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* TITLE */}
      <TextInput
        placeholder="Event title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
        style={[styles.event_descriptionInput, { marginBottom: 12 }]}
      />

      {/* 📅 TITLE */}
      <Text style={styles.event_datesTitle}>Event dates</Text>

      {/* ℹ️ INDICATION */}
      <Text style={styles.event_datesLabel}>
        {!startDate ? 'Select a start date' : !endDate ? 'Select an end date' : 'Dates selected'}
      </Text>

      {/* 📆 CALENDAR */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType={startDate && endDate && startDate !== endDate ? 'period' : 'simple'}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          arrowColor: colors.primary,
          todayTextColor: colors.primary,
          textDisabledColor: '#555',
        }}
      />

      {/* 🖼️ IMAGE */}
      <TouchableOpacity style={styles.event_imageBox} onPress={pickImage} activeOpacity={0.8}>
        {eventImage ? <Image source={{ uri: eventImage }} style={styles.event_image} /> : (
          <>
            <Text style={styles.event_placeholderText}>Add an image</Text>
            <Text style={styles.event_plus}>＋</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 📝 DESCRIPTION */}
      <View style={styles.event_descriptionBox}>
        <TextInput
          placeholder="Describe the event..."
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
          style={styles.event_descriptionInput}
        />
      </View>

      <TouchableOpacity style={styles.creator_mainButton} onPress={handlePublish} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.creator_mainButtonText}>Publish this event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
