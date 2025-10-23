import React, { useState } from 'react';
import { ScrollView,
        Text,
        StyleSheet,
        Modal,
        Image,
        FlatList,
        View,
        Pressable,
        Button
} from 'react-native';
import Svg, { Rect, Polygon, Line } from 'react-native-svg';
// import Button from 'react-bootstrap/Button';

// TODO : gérer l'affichage d'un bloc : numéro en gris en haut, couleur des prises en contours, possibilité de sélectionner tt les blocs d'un même numéro
// TODO : -afficher dans les bonnes dimensions les images
//       - mettre une bordure de style
//       - mettre un filtre : quand je clique sur un mur, je met les images qui ont le meme zoneid

export default function BoulderScreen() { 
  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const zones = [
    { id: 'murC', points: ' 40,300 20,300 20,400 80,400 60,380 40,380', label: 'Mur ouest' },
    { id: 'murDalle', points: '20,300 40,300 50,250 40,200 20,200', label: 'Mur O-milieu' },
    { id: 'murTension', points: '20,200 40,200 40,120 20,100', label: 'Mur O-haut' },
    { id: 'murToit', points: '20,100 40,120 50,80 120,80 130,50 40,50', label: 'Mur N-O' },
    { id: 'murDynamique', points: '130,50 120,80 220,80 220,50', label: 'Mur N-E' },
  ];

  const images = [
    { id: '1', zoneId: "murC", grade: 10, source:require('../../wall_images/wall_S-O.jpg')},
    { id: '2', zoneId: 'murC', grade: 6, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '3', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '4', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '5', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
  ]

  const grades = [
    { id:'1', difficulty: 1},
    { id:'2', difficulty: 2},
    { id:'3', difficulty: 3},
    { id:'4', difficulty: 4},
    { id:'5', difficulty: 5},
    { id:'6', difficulty: 6},
    { id:'7', difficulty: 7},
    { id:'8', difficulty: 8},
    { id:'9', difficulty: 9},
    { id:'10', difficulty: 10},
    { id:'11', difficulty: 11},
    { id:'12', difficulty: 12},
    { id:'13', difficulty: 13},
    { id:'14', difficulty: 14},
  ]

  

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedImage, setSelectedImage] = useState(false);



  function filterImages() {
    let res = images
    if (selectedZone && selectedGrade) {
      res = images.filter(img => selectedZone === img.zoneId && selectedGrade === img.grade)
    } else if (selectedZone) {
      res = images.filter(img => selectedZone === img.zoneId )

    } else if (selectedGrade) {
      res = images.filter(img => selectedGrade === img.grade )
    }

    return res
  }
  const filteredImages = filterImages()

  function countGrade(difficulty) {
    let res = 0;
    images.forEach((image) => {
      if (image.grade === difficulty) {
        res++
      }
    })
    return res
  }

  function handleCloseModal() {
    setSelectedImage(false);
  }

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const handleClickZone = (zoneId) => {
    setSelectedZone(prev => prev === zoneId ? null : zoneId);
  };

  const renderGrade =  ({item}) => {
    const isSelected = selectedGrade === item.difficulty;
    const backColor = isSelected ? '#8bc34a' : '#808080'

    return (
      <Pressable
      onPressIn={() => handleClickGrade(item.difficulty)}
      style={[styles.grade, { backgroundColor: backColor }]} // Permet d'afficher la feuille de style et de rajouter ce composant dynamique
      >
        <Text> {item.difficulty}  0/{countGrade(item.difficulty)}</Text>
      </Pressable>
    )
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svg height="500" width="350" style={styles.map}>
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            points={zone.points}
            fill={selectedZone === zone.id ? '#8bc34a' : '#808080'}
            stroke="#fff"
            strokeWidth="1"
            onPressIn={() => handleClickZone(zone.id)}
          />
        ))}
      </Svg>
      <View style={styles.container}>
        <Text style={styles.text}>
          Boulders
        </Text>
      </View>
      <FlatList
        data={grades}
        horizontal
        keyExtractor={(grade) => grade.id}
        renderItem={renderGrade}
        scrollEnabled={true}   // TODO : aggrandir la zone de scroll
        extraData={selectedGrade}
      />
      <FlatList
          data={filteredImages}
          renderItem={({item}) => <Image source={item.source} style={styles.image} />}
          // onPressIn={setSelectedImage(true)}
          keyExtractor={(image) => image.id}
          scrollEnabled={false}   // empêche le conflit de scroll
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      {/* {selectedImage && (      
        <Modal
        visible={selectedImage}
        onRequestClose={handleCloseModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Modal body text goes here.</Text>
            <Button title="Fermer" onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
      )
      } */}
    </ScrollView>

);
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingBottom: 60,
  },
  map: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 16,
  },
  image: {
    width: 170,
    height: 250,
    borderRadius: 5,
    borderColor: '#808080',
    borderWidth: 5,
    marginHorizontal: 8,
    marginBottom: 10,
    marginTop: 20,

  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  grade: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    width: 55,
    height: 30,
    borderRadius:6,
    marginHorizontal: 8,
  }
});
