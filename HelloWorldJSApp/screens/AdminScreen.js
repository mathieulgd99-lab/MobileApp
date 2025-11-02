import React, { useContext }from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react'
import styles from './styles';


export default function AdminScreen() {

  const {user, log_in, reg, log_out} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
      🏠 Bienvenue sur l'écran administrateur 
      </Text>
    </View>
  )
}