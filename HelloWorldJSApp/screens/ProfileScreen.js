import React, { useContext }from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react'

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);

  const {user, log_in, reg, log_out} = useContext(AuthContext);
  // const conditionRemplie = () => {
  //   if (newUser) {
  //     return password.length > 0 && email.length > 0 && username.length > 0}
  //   else {
  //     return password.length > 0 && email.length > 0
  //   }
  // }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
        🏠 Welcome {user.display_name} your email is {user.email}!
        </Text>
        <Button title="Disconnect" onPress={() => {log_out()}}></Button>
      </View>
    )
  }

  const handleSubmit = async () => {
    console.log("Submited")
    if (newUser) {
      console.log("start Registering")
      await reg(email,password, username)
      console.log(`End of submit`)
    } else {
      console.log("start login")
      await log_in(email,password)
      console.log(`End of submit`)
    }
  }

  return (
    <View style={styles.form}>
      <Text> Not connected</Text>
      <TextInput style={styles.inputText} value={email} placeholder='Email' onChangeText={setEmail}/>
      {newUser && <TextInput style={styles.inputText} value={username} placeholder='Username' onChangeText={setUsername}/>}
      <TextInput style={styles.inputText}  value={password} placeholder='********' onChangeText={setPassword}/>
      {/* disabled={!conditionRemplie()} */}
      <Button title="OK"  onPress={handleSubmit}/>

      {!newUser &&
      <View>
        <Text> No account ?</Text>
        <Button title="Create a new profile" onPress={() => {setNewUser(true)}}/>
      </View>
      }
      {newUser &&
      <View>
        <Text>Log in ?</Text>
        <Button title="Ecran connexion" onPress={() => {setNewUser(false)}}/>
      </View>
      }
    </View>
    )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    backgroundColor: '#white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#61dafb',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  inputText: {
    borderColor: 'black',
    borderWidth: 2,
  }
});
