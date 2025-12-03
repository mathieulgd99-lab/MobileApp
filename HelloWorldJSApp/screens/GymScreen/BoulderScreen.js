import React, { useState, useEffect, useContext } from 'react';
import { ScrollView,
        Text,
        Modal,
        Image,
        FlatList,
        View,
        ActivityIndicator,
        TouchableOpacity,
} from 'react-native';
import Svg, {Polygon } from 'react-native-svg';
import styles from '../styles';
import { getBoulders, markBoulderAsCompleted, getValidatedBoulders } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const API_BASE = "http://192.168.190.72:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES

export default function BoulderScreen() { 
  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const zones = [
    { id: 'murC', points: ' 40,300 20,300 20,400 80,400 60,380 40,380', label: 'Mur ouest' },
    { id: 'murDalle', points: '20,300 40,300 50,250 40,200 20,200', label: 'Mur O-milieu' },
    { id: 'murTension', points: '20,200 40,200 40,120 20,100', label: 'Mur O-haut' },
    { id: 'murToit', points: '20,100 40,120 50,80 120,80 130,50 40,50', label: 'Mur N-O' },
    { id: 'murDynamique', points: '130,50 120,80 220,80 220,50', label: 'Mur N-milieu' },
    { id: 'murPorte', points: '220,50 320,50 320,120, 295,120 295,80 220,80', label: 'Mur N-E' },
    { id: 'murDevers', points: '295,120 320,120 320,230 295,230 295,210 280,190 295,160', label: 'Mur E' },
    { id: 'murDiedre', points: '295,230 320,230 320,290 295,270', label: 'Mur E-milieu' },
    { id: 'murAngle', points: '295,270 320,290 250,290 260,270', label: 'Mur E-bas' },
    { id :'murAngle2', points: '250,290 250,310 255,320 295,320 295,325 320,325 320,300 260,300 260,290' , label: 'Mur central' },
    { id: 'murEasy', points: '295,325 320,325 320,400 250,400 250,380 295,380 ', label: 'Mur sud' },
  ];

  const {user, token} = useContext(AuthContext);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false)
  const [validatedBoulders, setValidatedBoulders] =  useState([]);

  useEffect(() => {
    async function loadImages() {
      console.log("Boulder.js : fetching boulders...");
      const result = await getBoulders();
      console.log("boulders",result)
      if (!result.error) {
        setImages(result.boulders);
      } else {
        console.log("Erreur getBoulders :", result.error);
      }
      const validated = await getValidatedBoulders(token);
      console.log("validated boulders",validated)
      if (!validated.error) {
        setValidatedBoulders(result.boulders);
      } else {
        console.log("Erreur getValidatedBoulders :", validated.error);
      }
      setLoading(false);
    }

    loadImages();
  }, []);

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

  const handleValidation = async ({item}) => {
    const result = await markBoulderAsCompleted(item,user,token);
    if (!result.error) {
      if (result.validated){
        setValidatedBoulders(validatedBoulders.push(item));
      } else {
        let unvalidBoulder = item;
        setValidatedBoulders(validatedBoulders.filter(element => element !== unvalidBoulder))
      }
    } else {
      console.log("Erreur validate boulder :", result.error);
    }

  };
  
  const renderGrade =  ({item}) => {
    const isSelected = selectedGrade === item.difficulty;
    const backColor = isSelected ? '#8bc34a' : '#808080'

    return (
      <TouchableOpacity
      onPress={() => handleClickGrade(item.difficulty)}
      >
        <Text style={[styles.grade, { backgroundColor: backColor }]}> {item.difficulty}  0/{countGrade(item.difficulty)}</Text>
      </TouchableOpacity>
    )
  }

  const renderImage = ({item}) => {
    return (
      <View>
        <TouchableOpacity
        onPress={() => handleClickImage(item)}>
          <Image source={{ uri: `${API_BASE}/${item.path}` }} style={[styles.image, {borderColor: item.color}]}/>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => handleValidation(item.id)}
        style={[
          styles.validationButton,
          { backgroundColor: validatedBoulders.includes(item) ? '#BDBDBD' : '#4CAF50'}
        ]}
        >
        <Text style={styles.validationIcon}>✓</Text>
        </TouchableOpacity>
      </View>
)
  }

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
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
            onPressOut={() => handleClickZone(zone.id)}
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
          scrollEnabled={false}
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
          
          <Image source={{ uri: `${API_BASE}/${selectedImage.path}` }} style={styles.image_zoomed}/>
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

                <TouchableOpacity
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
                </TouchableOpacity>
          </View>
        </View>
      </Modal>
      )
      }
    </ScrollView>
);
}