import React, { useState } from 'react';
import { ScrollView,
        Text,
        StyleSheet,
        TouchableOpacity,
        Modal,
        Image,
        FlatList,
        View
} from 'react-native';
import Svg, { Rect, Polygon, Line } from 'react-native-svg';


// TODO : gérer l'affichage d'un bloc : numéro en gris en haut, couleur des prises en contours, possibilité de sélectionner tt les blocs d'un même numéro
// TODO : -afficher dans les bonnes dimensions les images
//       - mettre une bordure de style
//       - mettre un filtre : quand je clique sur un mur, je met les images qui ont le meme zoneid

// const MAP_WIDTH = 350;
// const MAP_HEIGHT = 500;
// const IMAGE_MARGIN = 8;
// const GRID_COLUMNS = 2;
// const GRID_ITEM_WIDTH = (MAP_WIDTH - IMAGE_MARGIN * (GRID_COLUMNS + 1)) / GRID_COLUMNS;
// const SELECTED_ROW_ITEM_WIDTH = (MAP_WIDTH - IMAGE_MARGIN * 5) / 4; // 4 images côte à côte



export default function BoulderScreen() {
  const zones = [
    { id: 'murC', points: '20,400 40,380 60,380 80,400', color: '#8bc34a', label: 'Mur ouest' },
    { id: 'murCbis', points: '20,300 20,400 40,380 40,300', color: '#8bc34a', label: 'Mur ouestbis' },
    { id: 'murDalle', points: '20,300 40,300 50,250 40,200 20,200', color: '#ff6f61', label: 'Mur O-milieu' },
    { id: 'murTension', points: '20,200 40,200 40,120 20,100', color: '#61dafb', label: 'Mur O-haut' },
    { id: 'murToit', points: '20,100 40,120 50,80 120,80 130,50 40,50', color: '#8bc34a', label: 'Mur N-O' },
    { id: 'murDynamique', points: '130,50 120,80 220,80 220,50', color: '#ff6f61', label: 'Mur N-E' },
    { id: 'murJesaispas', points: '', color: '#61dafb', label: 'Mur E-haut' },

  ];

  const images = [
    { id: '1', zoneId: "murC", grade: 10, source:require('../../wall_images/wall_S-O.jpg')},
    { id: '2', zoneId: 'murC', grade: 6, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '3', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '4', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
    { id: '5', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg') },
  ]
  // Todo : stocker le nombre de murs avec un certains grade

  const grades = [
    { id:'1', difficulty: 1,},
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

  

  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const [selectedZone, setSelectedZone] = useState(null);
  const [seletedGrade, setSelectedGrade] = useState(null);


  const filteredImages = selectedZone ? images.filter(img => selectedZone === img.zoneId) : images
  // const filteredGrades = 

  const handleClickGrade = (gradeId) => {
    setSelectedGrade(prev => prev === gradeId ? null : gradeId)
  }

  const handleClickZone = (zoneId) => {
    setSelectedZone(prev => prev === zoneId ? null : zoneId);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svg height="500" width="350" style={styles.map}>
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            points={zone.points}
            fill={selectedZone === zone.id ? zone.color : '#808080'}
            stroke="#fff"
            strokeWidth="1"
            onPress={() => handleClickZone(zone.id)}
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
        onPress={(grade) => handleClickGrade(grade.id)}
        renderItem={({item}) => <Text style={styles.grade}> {item.id}   0/</Text>}
        scrollEnabled={true}   // TODO : aggrandir la zone de scroll
      />
      <FlatList
          data={filteredImages}
          renderItem={({item}) => <Image source={item.source} style={styles.image} />}
          keyExtractor={(image) => image.id}
          scrollEnabled={false}   // empêche le conflit de scroll
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
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
    fontSize: 15,
    width: 40,
    height: 20,
    backgroundColor: "#808080",
    borderRadius:6,
    marginHorizontal: 8,
  }
});
