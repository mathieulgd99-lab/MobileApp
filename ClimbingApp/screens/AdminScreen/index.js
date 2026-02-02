  import React, {useContext, useState, useEffect} from 'react';
  import { ScrollView,View, StyleSheet, Text,TouchableOpacity, ActivityIndicator } from 'react-native';
  import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
  import { Ionicons } from '@expo/vector-icons';

  import ModifyWallsScreen from './ModifyWallsScreen';
  import AddEventsScreen from './AddEventScreen';
  import { AuthContext } from '../../context/AuthContext';
  import { getUserProfile} from '../../api/auth';
  import { COLORS} from '../colors.js';

  //const API_BASE = "http://192.168.1.165:3000";
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

  const Tab = createMaterialTopTabNavigator();
  
  export default function ProfileScreen({ route, navigation }) {
    const { user: me, token } = useContext(AuthContext);
    const userIdParam = route?.params?.userId;

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
  
        </View>
  
        {/* TABS */}
        <View style={styles.tabsContainer}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: COLORS.primary,
              tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
              tabBarStyle: { backgroundColor: '#1e1e1e' },
              tabBarLabelStyle: { fontWeight: 'bold' },
            }}
          >
            <Tab.Screen name="Modify the walls">
              {props => (
                  <ModifyWallsScreen
                  {...props}
                  profileUser={profileUser}
                  token={token}
                />
              )}
            </Tab.Screen>
  
            <Tab.Screen name="Add an event">
              {props => (
              <AddEventsScreen
                  {...props}
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
});
