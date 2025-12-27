import React, { useContext }from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { addBoulder } from '../api/auth';
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useBoulders from './Hooks/useBoulder';
import styles from './styles';

export default function AdminScreen() {

  const {user, token} = useContext(AuthContext);
  const [color, setColor] = useState('');
  const [pickedImage, setPickedImage] = useState(null);
  const [grade, setGrade] = useState('');
  const [zoneId, setZoneId] = useState('');

  const {
    refresh
  } = useBoulders(token);
  const pickImage = async () => {
    console.log("Click admin image");
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert(
        "Permission refused",
        "The application need to access the galery to select an image."
      );
      return;
    }
  
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
      Alert.alert("Erreur", "Impossible to open the galery.");
    }
  };


  const uploadImage = async () => {
    if (!pickedImage) return alert("Select an image");
    if (!zoneId || !grade || !color) return alert("Missing fields");

    try {
      console.log("token :",token)
      const res = await addBoulder(pickedImage, zoneId, grade, color, token);
      if (!res || res.error) {
        console.log("Error of image upload", res);
        return alert("Error of image upload");
      }
      alert("Image send !");
      setPickedImage(null);
      setZoneId('');
      setGrade('');
      setColor('');
      await refresh()
    } catch (err) {
        console.error("uploadImage error", err);
        alert("Error during the upload");
      }
  };

  return (
    <ScrollView style={styles.admin_container}>
      <Text style={styles.admin_title}>
      🏠 Welcome on admin page ! 
      </Text>
      <View style={styles.admin_form}>


      <Button title="Add a wall" onPress={pickImage} />

      {pickedImage && (
        <Image source={{ uri: pickedImage.uri }} style={styles.admin_preview} />
      )}
      <Picker
        selectedValue={grade}
        onValueChange={(itemValue) => setGrade(itemValue)}
        style={styles.admin_picker}
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
      <Text style={styles.admin_smallText}>
        Actual selection : {grade || "No grade"}
      </Text>


      <Picker
        selectedValue={color}
        onValueChange={(itemValue) => setColor(itemValue)}
        style={styles.admin_picker}
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
  <Text style={styles.admin_smallText}>
  Actual selection : {color || "No color"}
  </Text>

      <Picker
        selectedValue={zoneId}
        onValueChange={(itemValue) => setZoneId(itemValue)}
        style={styles.admin_picker}
      >
        <Picker.Item label="murDalle" value="murDalle" />
        <Picker.Item label="murTension" value="murTension" />
        <Picker.Item label="murToit" value="murToit" />
        <Picker.Item label="murDynamique" value="murDynamique" />
        <Picker.Item label="murPorte" value="murPorte" />
        <Picker.Item label="murDevers" value="murDevers" />
        <Picker.Item label="murDiedre" value="murDiedre" />
        <Picker.Item label="murAngle" value="murAngle" />
        <Picker.Item label="murAngle2" value="murAngle2" />
        <Picker.Item label="murDiedre" value="murDiedre" />
        <Picker.Item label="murEasy" value="murEasy" />
      </Picker>
      <Text style={styles.admin_smallText}>
      Actual selection : {zoneId || "No wall"}
      </Text>
      <Button title="Send" onPress={uploadImage} />
      </View>
    </ScrollView>
    
  )
}
