import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MachinesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚙️ Écran avec les blocs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});