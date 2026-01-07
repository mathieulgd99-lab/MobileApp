import React, { useContext, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles';
import colors from '../colors';

export default function AddEvent() {

  const { user, token } = useContext(AuthContext);

  const [eventImage, setEventImage] = useState(null);
  const [description, setDescription] = useState('');

  const [startDate, setStartDate] = useState(null); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(null);

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
      Alert.alert("Permission refused", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={styles.event_container}
      contentContainerStyle={{ flexGrow: 1 }}
    >

      {/* 📅 TITLE */}
      <Text style={styles.event_datesTitle}>
        Event dates
      </Text>

      {/* ℹ️ INDICATION */}
      <Text style={styles.event_datesLabel}>
        {!startDate
          ? "Select a start date"
          : !endDate
          ? "Select an end date"
          : "Dates selected"}
      </Text>

      {/* 📆 CALENDAR */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        markingType={
          startDate && endDate && startDate !== endDate
            ? 'period'
            : 'simple'
        }
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
      <TouchableOpacity
        style={styles.event_imageBox}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {eventImage ? (
          <Image source={{ uri: eventImage }} style={styles.event_image} />
        ) : (
          <>
            <Text style={styles.event_placeholderText}>
              Add an image
            </Text>
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


      <TouchableOpacity
        style={styles.creator_mainButton}
        onPress={() => {
          Alert.alert("Event published!", "The event has been successfully created.");
          // Here you would typically handle the event creation logic
        }}
      >
        <Text style={styles.creator_mainButtonText}>Publish this event</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
