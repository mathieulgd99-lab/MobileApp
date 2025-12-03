import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen() {
  const {user, log_in, reg, log_out} = useContext(AuthContext);
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🏠 Welcome {user.display_name}!</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Welcome on the HomePage !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#61dafb',
    fontSize: 20,
  },
});
