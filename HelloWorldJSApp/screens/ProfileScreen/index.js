import React, {useContext, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import HistoryScreen from './HistoryScreen';
import StatisticScreen from './StatisticScreen';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile, updateDisplayName, updatePassword } from '../../api/auth';

//const API_BASE = "http://192.168.1.165:3000";
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ route, navigation }) {
  const { user: me, token, updateUser, log_out } = useContext(AuthContext);
  const userIdParam = route?.params?.userId;

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // modals individuels
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  // form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmPwVisible, setConfirmPwVisible] = useState(false);
  const [pwSubmitting, setPwSubmitting] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [usernameSubmitting, setUsernameSubmitting] = useState(false);

  const isMyProfile = !userIdParam || userIdParam === me?.id;
  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (isMyProfile) {
        setProfileUser(me);
        setLoading(false);
        return;
      }

      try {
        const res = await getUserProfile(userIdParam, token);
        if (!res?.error && mounted) {
          setProfileUser(res.user);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [userIdParam, me, token]);

  // ouvre le modal correspondant depuis le menu
  function HandleChanges(modification){
    setSettingsVisible(false);
    if (modification === "pw"){
      setNewPassword('');
      setConfirmPassword('');
      setPwVisible(false);
      setConfirmPwVisible(false);
      setShowChangePassword(true);
    } else if (modification === "name") {
      setNewUsername(profileUser?.display_name || '');
      setShowChangeUsername(true);
    }
  }


  function handleDisconnect() {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect ?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setSettingsVisible(false);
            log_out();
          },
        },
      ]
    );
  }


  async function submitPasswordChange() {
    // validations côté client
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Remplis les deux champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    // if (newPassword.length < 6) {
    //   Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
    //   return;
    // }

    setPwSubmitting(true);
    try {
      const res = await updatePassword(token, newPassword);
      if (res?.error) {
        // si res.error est un objet ou une string
        console.error('updatePassword error', res.error);
        const msg = typeof res.error === 'string' ? res.error : (res.error.message || JSON.stringify(res.error));
        Alert.alert('Erreur', msg || 'Erreur serveur');
      } else {
        Alert.alert('Succès', 'Mot de passe mis à jour.');
        setShowChangePassword(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de changer le mot de passe.');
    } finally {
      setPwSubmitting(false);
    }
  }

  async function submitUsernameChange() {
    if (!newUsername || newUsername.trim().length < 3) {
      Alert.alert('Erreur', 'Le nom doit contenir au moins 3 caractères.');
      return;
    }

    setUsernameSubmitting(true);
    try {
      const res = await updateDisplayName(token, newUsername.trim());
      if (res?.error) {
        console.error('updateDisplayName error', res.error);
        const msg = typeof res.error === 'string' ? res.error : (res.error.message || JSON.stringify(res.error));
        Alert.alert('Erreur', msg || 'Erreur serveur');
      } else {
        // mettre à jour l'affichage local
        setProfileUser(prev => ({ ...prev, display_name: newUsername.trim() }));
        Alert.alert('Succès', 'Nom d\'utilisateur mis à jour.');
        updateUser(res.user);
        setShowChangeUsername(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de changer le nom.');
    } finally {
      setUsernameSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff' }}>Profil introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <View style={styles.headerLeft}>
        {!isMyProfile && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.username}>
            {profileUser.display_name}
          </Text>
          <Text style={styles.subtitle}>
            Climber since{' '}
            {new Date(profileUser.created_at).toLocaleDateString()}
          </Text>
        </View>

        {isMyProfile && (
          <TouchableOpacity
            onPress={() => setSettingsVisible(true)}
            style={styles.settingsButton}
          >
            <Ionicons
              name="settings-outline"
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* SETTINGS MENU */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.settingsMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => HandleChanges("name")}
              >
                <Text style={styles.menuText}>Change username</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => HandleChanges("pw")}
              >
                <Text style={styles.menuText}>Change password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                    style={[styles.menuItem, styles.disconnectItem]}
                    onPress={handleDisconnect}
                  >
                    <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        visible={showChangePassword}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePassword(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChangePassword(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Change password</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="New password"
                  placeholderTextColor="#999"
                  secureTextEntry={!pwVisible}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => setPwVisible(v => !v)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={pwVisible ? "eye" : "eye-off"} size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!confirmPwVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => setConfirmPwVisible(v => !v)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={confirmPwVisible ? "eye" : "eye-off"} size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={() => setShowChangePassword(false)}
                  disabled={pwSubmitting}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={submitPasswordChange}
                  disabled={pwSubmitting}
                >
                  {pwSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* CHANGE USERNAME MODAL */}
      <Modal
        visible={showChangeUsername}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangeUsername(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowChangeUsername(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Change username</Text>

              <View style={[styles.inputContainer, { paddingRight: 12 }]}>
                <TextInput
                  placeholder="Nouveau nom d'utilisateur"
                  placeholderTextColor="#999"
                  value={newUsername}
                  onChangeText={setNewUsername}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={() => setShowChangeUsername(false)}
                  disabled={usernameSubmitting}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={submitUsernameChange}
                  disabled={usernameSubmitting}
                >
                  {usernameSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#61dafb',
            tabBarIndicatorStyle: { backgroundColor: '#61dafb' },
            tabBarStyle: { backgroundColor: '#1e1e1e' },
            tabBarLabelStyle: { fontWeight: 'bold' },
          }}
        >
          <Tab.Screen name="Statistic">
            {() => (
              <StatisticScreen
                user={profileUser}
                token={token}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="History">
            {() => (
              <HistoryScreen
                profileUser={profileUser}
                token={token}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  header: {
    height: 130,
    backgroundColor: '#ff7a00',
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7a00',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 130,
  },

  backButton: {
    marginRight: 8,
  },

  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
    marginTop: 2,
  },

  tabsContainer: {
    flex: 1,
  },

  settingsButton: {
    marginLeft: 'auto',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingRight: 16,
  },

  settingsMenu: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    alignSelf: 'flex-end',
    width: 200,
    overflow: 'hidden',
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  menuText: {
    color: '#fff',
    fontSize: 15,
  },

  /* Form modal styles */
  formContainer: {
    alignSelf: 'center',
    marginTop: 120,
    width: '90%',
    backgroundColor: '#1b1b1b',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  formTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },

  textInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 8,
  },

  eyeIcon: {
    marginLeft: 8,
  },

  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },

  button: {
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },

  buttonPrimary: {
    backgroundColor: '#ff7a00',
  },

  buttonSecondary: {
    backgroundColor: '#333',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disconnectItem: {
    borderBottomWidth: 0,
  },
  
  disconnectText: {
    color: '#ff4d4f',
    fontSize: 15,
    fontWeight: '600',
  },
});
