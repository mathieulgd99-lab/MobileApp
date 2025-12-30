import React, {useContext, useState, useEffect} from 'react';
import { ScrollView,
        View,
        StyleSheet,
        Text,
        TouchableOpacity,
        ActivityIndicator,
        Modal, 
      } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import HistoryScreen from './HistoryScreen';
import StatisticScreen from './StatisticScreen';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile, updateDisplayName, updatePassword} from '../../api/auth';

const API_BASE = "http://192.168.190.72:3000";
const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen({ route, navigation }) {
  const { user: me, token } = useContext(AuthContext);
  const userIdParam = route?.params?.userId;

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);

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

  async function HandleChanges(modification){
    if (modification === "pw"){
      const res = await updatePassword(token)
    } else if (modification === "name") {
      const res = await updateDisplayName(token)

    }
    setSettingsVisible(false)
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

      {/* MODAL CHANGE USERNAME/PASSWORD */}
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
          <View style={styles.settingsMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => HandleChanges("name")}
            >
              <Text style={styles.menuText}>Change username</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => HandleChanges("pw")}
            >
              <Text style={styles.menuText}>Change password</Text>
            </TouchableOpacity>
          </View>
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
                profileUser={profileUser}
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

});
