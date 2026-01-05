import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import styles from '../styles';
import { BLOC_COLORS } from '../colors';
import { AuthContext } from '../../context/AuthContext';
import { addBoulder} from '../../api/auth';


const WALLS = [
  { label: 'Mur Coin', value: 'murCoin' },
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
  const { user: me, token } = useContext(AuthContext);
  const [phase, setPhase] = useState(1);
  const [selectedWall, setSelectedWall] = useState(null);

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [difficultyOpen, setDifficultyOpen] = useState(false);


  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!res.canceled) {
      const asset = res.assets[0];
  
      setImages(prev => {
        const next = [...prev, { asset, blocs: [] }];
        setCurrentImageIndex(next.length - 1);
        return next;
      });
  
      setPhase(3);
    }
  };
  
  
  
  const addBloc = () => {
    if (!selectedColor || !selectedDifficulty || currentImageIndex === null) {
      return alert("Missing data");
    }
  
    const newBloc = {
      color: selectedColor,
      difficulty: selectedDifficulty,
    };
  
    setImages(prev =>
      prev.map((img, i) =>
        i === currentImageIndex
          ? { ...img, blocs: [...img.blocs, newBloc] }
          : img
      )
    );
  
    setSelectedColor(null);
    setSelectedDifficulty(null);
  
    alert("Bloc added to image");
  };

  const submitAllBoulders = async () => {
    try {
      for (const img of images) {
        for (const bloc of img.blocs) {
          await addBoulder(
            img.asset,
            selectedWall,
            bloc.difficulty,
            bloc.color,
            token
          );
        }
      }
  
      alert("All boulders uploaded!");
      setImages([]);
      setPhase(1);
  
    } catch (err) {
      console.error(err);
      alert("Error while uploading boulders");
    }
  };  
  
  return (
    <View style={styles.creator_container}>


      {/* ------------------------ PHASE 1 : SELECT WALL ------------------------ */}
      {phase === 1 && (
        <ScrollView>
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
        </ScrollView>
      )}



      {/* ------------------------ PHASE 2 : ADD IMAGES ------------------------ */}
      {phase === 2 && (
        <View>
          <Text style={styles.creator_title}> Add a picture for : {WALLS.find(w => w.value === selectedWall)?.label || selectedWall}</Text>

          <TouchableOpacity style={styles.creator_mainButton} onPress={pickImage}>
            <Text style={styles.creator_mainButtonText}>Choose an image</Text>
          </TouchableOpacity>
          <ScrollView>
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentImageIndex(index);
                  setPhase(3);
                }}
              >
                <Image
                  source={{ uri: item.asset.uri }}
                  style={styles.creator_previewImage}
                />
                <Text>{item.blocs.length} blocs</Text>
              </TouchableOpacity>
            )}
          />
          </ScrollView>


          <TouchableOpacity
            style={styles.creator_secondaryButton}
            onPress={() => setPhase(1)}
          >
            <Text style={styles.creator_secondaryButtonText}>Change wall</Text>
          </TouchableOpacity>
        </View>
      )}
      {images.length > 0 && (
        <TouchableOpacity
          style={styles.creator_mainButton}
          onPress={submitAllBoulders}
        >
          <Text style={styles.creator_mainButtonText}>
            Upload all boulders
          </Text>
        </TouchableOpacity>
      )}



      {/* ------------------------ PHASE 3 : ADD A BOULDER ------------------------ */}
      {phase === 3 && (
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.creator_title}> Add a boulder </Text>
          <Image
            source={{ uri: images[currentImageIndex]?.asset.uri }}
            style={styles.creator_bigImage}
          />
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
                setCurrentImageIndex(null);
                setPhase(2);
              }}
            >
              <Text style={styles.creator_secondaryButtonText}>
                Back to images
              </Text>
            </TouchableOpacity>


          <TouchableOpacity
            style={styles.creator_secondaryButton}
            onPress={() => {
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
