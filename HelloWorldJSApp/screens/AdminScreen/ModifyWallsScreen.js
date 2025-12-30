import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import styles from '../styles';
import { BLOC_COLORS } from '../colors';


const WALLS = [
  { label: 'Mur Dalle', value: 'murDalle' },
  { label: 'Mur Tension', value: 'murTension' },
  { label: 'Mur Toit', value: 'murToit' },
  { label: 'Mur Dynamique', value: 'murDynamique' },
  { label: 'Mur Porte', value: 'murPorte' },
  { label: 'Mur Devers', value: 'murDevers' },
  { label: 'Mur Diedre', value: 'murDiedre' },
  { label: 'Mur Angle', value: 'murAngle' },
  { label: 'Mur Angle 2', value: 'murAngle2' },
  { label: 'Mur Easy', value: 'murEasy' },
];

const DIFFICULTIES = Array.from({ length: 14 }, (_, i) => String(i + 1));

export default function BlocCreatorScreen() {
  const [phase, setPhase] = useState(1);
  const [selectedWall, setSelectedWall] = useState(null);

  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  const [blocs, setBlocs] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [difficultyOpen, setDifficultyOpen] = useState(false);


  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync();
    if (!res.canceled) {
      setCurrentImage(res.assets[0].uri);
      setPhase(3);
    }
  };

  const addBloc = () => {
    if (!selectedColor || !selectedDifficulty)
      return alert("Select a color and difficulty");

    const newBloc = {
      id: Date.now(),
      color: selectedColor,
      difficulty: selectedDifficulty,
    };

    // Vérifie si l'image existe déjà dans la liste des images
    const found = images.find(img => img.image === currentImage);

    let updated;

    if (found) {
      // Si l'image est déjà enregistrée → on lui ajoute un bloc
      updated = images.map(img =>
        img.image === currentImage
          ? { ...img, blocs: [...img.blocs, newBloc] }
          : img
      );
    } else {
      // Si c'est la première fois qu'on ajoute un bloc sur cette image
      updated = [...images, { image: currentImage, blocs: [newBloc] }];
    }

    setImages(updated);

    // Reset UI
    setSelectedColor(null);
    setSelectedDifficulty(null);

    alert("Boulder added!");
  };


  const validateImage = () => {
    setImages([...images, {
      image: currentImage,
      blocs: blocs,
    }]);

    setBlocs([]);
    setCurrentImage(null);
    setPhase(2);
  };

  return (
    <View style={styles.creator_container}>


      {/* ------------------------ PHASE 1 : SELECT WALL ------------------------ */}
      {phase === 1 && (
        <View>
          <Text style={styles.creator_title}> Choose a wall </Text>

          {WALLS.map((w) => (
            <TouchableOpacity
              key={w.value}
              style={[
                styles.creator_optionButton,
                selectedWall === w.value && styles.creator_optionSelected
              ]}
              onPress={() => { setSelectedWall(w.value); setPhase(2); }}
            >
              <Text style={styles.creator_optionText}>{w.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}



      {/* ------------------------ PHASE 2 : ADD IMAGES ------------------------ */}
      {phase === 2 && (
        <View>
          <Text style={styles.creator_title}> Add a picture for : {WALLS.find(w => w.value === selectedWall)?.label || selectedWall}</Text>

          <TouchableOpacity style={styles.creator_mainButton} onPress={pickImage}>
            <Text style={styles.creator_mainButtonText}>Choose an image</Text>
          </TouchableOpacity>

          <FlatList
            data={images}
            keyExtractor={(item) => item.image}
            renderItem={({ item }) => (
                  <View style={styles.creator_previewCard}>
                                  <TouchableOpacity
                    onPress={() => {
                      setCurrentImage(item.image);
                      setPhase(3);
                    }}
                    style={styles.creator_previewTouchable}
                  >
                    <Image source={{ uri: item.image }} style={styles.creator_previewImage} />

                    {/* Icône crayon */}
                    <View style={styles.creator_editIcon}>
                      <Ionicons name="create-outline" size={22} color="#fff" style={{ opacity: 0.9 }} />
                    </View>
                  </TouchableOpacity>

                <Text style={styles.creator_previewTitle}>{item.blocs.length} blocs</Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.creator_secondaryButton}
            onPress={() => setPhase(1)}
          >
            <Text style={styles.creator_secondaryButtonText}>Change wall</Text>
          </TouchableOpacity>
        </View>
      )}



      {/* ------------------------ PHASE 3 : ADD A BOULDER ------------------------ */}
      {phase === 3 && (
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.creator_title}> Add a boulder </Text>

          <Image source={{ uri: currentImage }} style={styles.creator_bigImage} />

          <Text style={styles.creator_subtitle}>Color of the boulder</Text>
          <View style={styles.creator_row}>
            {BLOC_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.creator_colorCircle,
                  { backgroundColor: c, borderWidth: selectedColor === c ? 3 : 0 }
                ]}
                onPress={() => setSelectedColor(c)}
              />
            ))}
          </View>
            <Text style={styles.creator_subtitle}>Difficulty</Text>

            <View style={styles.creator_dropdown}>

              {/* Bouton qui ouvre/ferme */}
              <TouchableOpacity
                style={styles.creator_dropdownLabel}
                onPress={() => setDifficultyOpen(!difficultyOpen)}
              >
                <Text style={styles.creator_dropdownText}>
                  {selectedDifficulty || "Choose difficulty"}
                </Text>
              </TouchableOpacity>

              {/* Liste affichée seulement si ouverte */}
              {difficultyOpen && (
                <View style={styles.creator_dropdownList}>
                  {DIFFICULTIES.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={styles.creator_dropdownItem}
                      onPress={() => {
                        setSelectedDifficulty(d);
                        setDifficultyOpen(false); // ferme le menu après sélection
                      }}
                    >
                      <Text style={styles.creator_dropdownText}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>


          <TouchableOpacity style={styles.creator_mainButton} onPress={addBloc}>
            <Text style={styles.creator_mainButtonText}>Add boulder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.creator_secondaryButton}
            onPress={() => {
              setCurrentImage(null);
              setPhase(2);
            }}
          >
            <Text style={styles.creator_secondaryButtonText}>Add another image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.creator_secondaryButton}
            onPress={() => {
              setCurrentImage(null);
              setImages([]);
              setPhase(1);
            }}
          >
            <Text style={styles.creator_secondaryButtonText}>Add another wall</Text>
          </TouchableOpacity>


        </ScrollView>
      )}

    </View>
  );
}
