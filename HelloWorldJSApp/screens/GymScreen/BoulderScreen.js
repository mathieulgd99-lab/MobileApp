import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, Modal } from 'react-native';
import Svg, { Rect, Polygon, Line } from 'react-native-svg';

export default function BoulderScreen() {
  const zones = [
    // { id: 'murA', points: '20,20 280,20 280,40 20,40', color: '#61dafb', label: 'Mur nord' },
    // { id: 'murAb', points: '20,20 280,20 280,40 20,40', color: '#61dafb', label: 'Mur nord' },
    // { id: 'murB', points: '280,20 300,120 280,130 260,40', color: '#ff6f61', label: 'Mur est' },
    { id: 'murC', points: '20,400 40,380 60,380 80,400', color: '#8bc34a', label: 'Mur ouest' },
    { id: 'murCbis', points: '20,300 20,400 40,380 40,300', color: '#8bc34a', label: 'Mur ouestbis' },
    { id: 'murDalle', points: '20,300 40,300 50,250 40,200 20,200', color: '#ff6f61', label: 'Mur O-milieu' },
    { id: 'murTension', points: '20,200 40,200 40,120 20,100', color: '#61dafb', label: 'Mur O-haut' },
    { id: 'murToit', points: '20,100 40,120 50,80 120,80 130,50 40,50', color: '#8bc34a', label: 'Mur N-O' },
    { id: 'murDynamique', points: '130,50 120,80 220,80 220,50', color: '#ff6f61', label: 'Mur N-E' },
    { id: 'murJesaispas', points: '', color: '#61dafb', label: 'Mur E-haut' },

  ];
  // 20,40 = en haut a gauche : 0,0 = tout en haut a gauche, le premier point = la largeur
  const [selectedZone, setSelectedZone] = useState(null);

  // TODO : gérer l'affichage d'un bloc : numéro en gris en haut, couleur des prises en contours, possibilité de sélectionner tt les blocs d'un même numéro

  return (
    <View style={styles.container}>
      <Svg height="500" width="350" style={styles.map}>
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            points={zone.points}
            fill={zone.color}
            stroke="#fff"
            strokeWidth="1"
            onPress={() => setSelectedZone(zone)}
          />
        ))}
      </Svg>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: '#61dafb',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  closeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});