import React, { useState } from 'react';
import { ScrollView,
        Text,
        Modal,
        Image,
        FlatList,
        View,
        Pressable,
} from 'react-native';
import Svg, {Polygon } from 'react-native-svg';
import styles from './styles';


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
    { id: '1', zoneId: "murC", grade: 10, source:require('../../wall_images/wall_S-O.jpg'), color: "gold"},
    { id: '2', zoneId: 'murC', grade: 6, source: require('../../wall_images/wall_S-O.jpg'), color: "green" },
    { id: '3', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg'), color: "orange" },
    { id: '4', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg'), color: "pink" },
    { id: '5', zoneId: 'murC', grade: 7, source: require('../../wall_images/wall_S-O.jpg'), color: "gold" },
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false)



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
    setShowImage(false);
  }

  const handleClickGrade = (gradeDifficulty) => {
    setSelectedGrade(prev => prev === gradeDifficulty ? null : gradeDifficulty)
  }

  const handleClickZone = (zoneId) => {
    setSelectedZone(prev => prev === zoneId ? null : zoneId);
  };

  const handleClickImage = (image) => {
    setSelectedImage(image)
    setShowImage(true)
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

  const renderImage = ({item}) => {
    return (
      <Pressable
      onPressIn={() => handleClickImage(item)}>
        <Image source={item.source} style={[styles.image, {borderColor: item.color}]}/>
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
          renderItem={renderImage}
          keyExtractor={(image) => image.id}
          scrollEnabled={false}   // empêche le conflit de scroll
          numColumns={2}
          columnWrapperStyle={styles.row}
        />


      {/* Show the image on full screen when we click on one */}
      {showImage && (      
        <Modal
        visible={showImage}
        onRequestClose={handleCloseModal}
        animationType="fade"
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.header_grade}>{selectedImage.grade}</Text>
          </View>
          
          <Image source={selectedImage.source} style={styles.image_zoomed}/>
          <View style={[
                styles.footer,
                { backgroundColor: selectedImage?.color || '#000' }
              ]}>
                <Text style={[
                  styles.footerText,
                ]}>
                  Ouvert depuis : 
                </Text>

                <Text style={[
                  styles.footerText,
                ]}>
                  Points : 
                </Text>

                <Text style={[
                  styles.footerText,
                ]}>
                  Tops : 
                </Text>

                <Pressable
                  onPress={handleCloseModal}
                  style={[
                    styles.footerButton,
                  ]}
                >
                  <Text style={[
                    styles.footerButtonText
                  ]}>
                    Fermer
                  </Text>
                </Pressable>
          </View>
        </View>
      </Modal>
      )
      }
    </ScrollView>
);
}