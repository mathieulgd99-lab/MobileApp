import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from './styles';



export default function ConnexionScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);

  const { user, log_in, reg, log_out } = useContext(AuthContext);

  // --------------------------
  //    SI L’UTILISATEUR EST CONNECTÉ
  // --------------------------
  if (user) {
    return (
      <View style={styles.connexion_container}>
        <Text style={styles.connexion_text}>
          🏠 Welcome {user.display_name}, your email is {user.email}!
        </Text>

        <TouchableOpacity
          style={styles.connexion_logoutButton}
          onPress={log_out}
        >
          <Text style={styles.connexion_logoutText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------
  //    SUBMIT
  // --------------------------
  const handleSubmit = async () => {
    if (newUser) {
      res = await reg(email, password, username);
      if (res)  {
        await login(email,password)
      } else {
        Alert.alert(
          "Account creation failed ❌",
          "Please check your information and try again."
        );
        return;
      }
    } else {
      const res = await log_in(email, password);

      if (!res) {
        Alert.alert(
          "Login failed",
          "Wrong email or password."
        );
      }
    }
  };

  // --------------------------
  //    FORMULAIRE
  // --------------------------
  return (
    <ScrollView contentContainerStyle={styles.connexion_container} keyboardShouldPersistTaps="handled">

      <Image source={require("../wall_images/logo_with_vietclimb_no_back.png")} style={styles.logo} />
      
      <Text style={styles.connexion_welcome}>
        Chào mừng đến với ĐáBloc !
      </Text>

      <Text style={styles.connexion_welcomeSub}>
        Welcome on ĐáBloc 🇻🇳
      </Text>



      <View style={styles.connexion_form}>

        <Text style={styles.connexion_title}>
          {newUser ? "Create Account" : "Login"}
        </Text>

        <TextInput
          style={styles.connexion_inputText}
          value={email}
          placeholder="Email"
          placeholderTextColor="#888"
          onChangeText={setEmail}
        />

        {newUser && (
          <TextInput
            style={styles.connexion_inputText}
            value={username}
            placeholder="Username"
            placeholderTextColor="#888"
            onChangeText={setUsername}
          />
        )}

        <TextInput
          style={styles.connexion_inputText}
          value={password}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.connexion_button}
          onPress={handleSubmit}
        >
          <Text style={styles.connexion_buttonText}>OK</Text>
        </TouchableOpacity>

        <View style={styles.connexion_switchContainer}>
          {!newUser ? (
            <>
              <Text style={styles.connexion_switchText}>No account?</Text>
              <TouchableOpacity onPress={() => setNewUser(true)}>
                <Text style={styles.connexion_switchButton}>Create a new profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.connexion_switchText}>Already registered?</Text>
              <TouchableOpacity onPress={() => setNewUser(false)}>
                <Text style={styles.connexion_switchButton}>Back to login</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </View>
    </ScrollView>
  );
}
