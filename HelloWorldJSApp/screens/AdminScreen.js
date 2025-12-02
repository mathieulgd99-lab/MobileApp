import React, { useContext }from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Alert
 } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { addImage } from '../api/auth';
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
// import styles from './styles';



export default function AdminScreen() {

  const {user, token, log_in, reg, log_out} = useContext(AuthContext);
  const [color, setColor] = useState('');
  const [pickedImage, setPickedImage] = useState(null);
  const [grade, setGrade] = useState('');
  const [zoneId, setZoneId] = useState('');


  const pickImage = async () => {
    console.log("Click admin image");
  
    // 1. Demander la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert(
        "Permission refusée",
        "L'application a besoin d'accéder à la galerie pour sélectionner une image."
      );
      return;
    }
  
    // 2. Ouvrir la galerie
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });
  
      if (result.canceled) return;
  
      const asset = result.assets[0];
      setPickedImage(asset);
    } catch (err) {
      console.error("pickImage exception", err);
      Alert.alert("Erreur", "Impossible d’ouvrir la galerie.");
    }
  };


  const uploadImage = async () => {
    if (!pickedImage) return alert("Sélectionne une image");
    if (!zoneId || !grade || !color) return alert("Champs manquants");

    try {
      const res = await addImage(pickedImage, zoneId, grade, color, token);
      if (!res || res.error) {
        console.log("Erreur d'upload d'images", res);
        return alert("Erreur lors de l'upload");
      }
      alert("Image envoyée !");
      setPickedImage(null);
      setZoneId('');
      setGrade('');
      setColor('');
    } catch (err) {
        console.error("uploadImage error", err);
        alert("Erreur lors de l'upload");
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
      🏠 Bienvenue sur l'écran administrateur 
      </Text>
      <View style={styles.form}>


      <Button title="📸 Ajouter un mur" onPress={pickImage} />

      {pickedImage && (
        <Image source={{ uri: pickedImage.uri }} style={styles.preview} />
      )}
      <Picker
        selectedValue={grade}
        onValueChange={(itemValue) => setGrade(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="6" value="6" />
        <Picker.Item label="7" value="7" />
        <Picker.Item label="8" value="8" />
        <Picker.Item label="9" value="9" />
        <Picker.Item label="10" value="10" />
        <Picker.Item label="11" value="11" />
        <Picker.Item label="12" value="12" />
        <Picker.Item label="13" value="13" />
        <Picker.Item label="14" value="14" />
      </Picker>
      <Text style={styles.smallText}>
        Sélection actuelle : {grade || "Aucun grade"}
      </Text>


      <Picker
        selectedValue={color}
        onValueChange={(itemValue) => setColor(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="black" value="black" />
        <Picker.Item label="blue" value="blue" />
        <Picker.Item label="green" value="green" />
        <Picker.Item label="orange" value="orange" />
        <Picker.Item label="pink" value="pink" />
        <Picker.Item label="purple" value="blueviolet" />
        <Picker.Item label="red" value="red" />
        <Picker.Item label="white" value="white" />
        <Picker.Item label="yellow" value="gold" />
      </Picker>
      <Text style={styles.smallText}>
        Sélection actuelle : {color || "Aucune couleur"}
      </Text>

      <Picker
        selectedValue={zoneId}
        onValueChange={(itemValue) => setZoneId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="murDalle" value="murDalle" />
        <Picker.Item label="murTension" value="murTension" />
        <Picker.Item label="murToit" value="murToit" />
        <Picker.Item label="murDynamique" value="murDynamique" />
      </Picker>
      <Text style={styles.smallText}>
        Sélection actuelle : {zoneId || "Aucun mur"}
      </Text>
      <Button title="📤 Envoyer" onPress={uploadImage} />
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },

  text: {
    color: "#61dafb",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  smallText: {
    color: "#61dafb",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  picker: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginTop: 15,
    color: "white",
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 15,
  },

  label: {
    color: "#ccc",
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },

  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
  },
});
