import * as React from 'react';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, AuthContext } from './context/AuthContext';

import HomeScreen from './screens/HomeScreen';
import GymScreen from './screens/GymScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import ConnexionScreen from './screens/ConnexionScreen';
import { COLORS } from './screens/colors';


const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

/**
 * Composant qui affiche les tabs (pour les utilisateurs connectés)
 */
function AppTabs() {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home page') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Gym') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
          else if (route.name === 'Admin') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: { backgroundColor: COLORS.background},
      })}
    >
      <Tab.Screen name="Gym" component={GymScreen} />
      <Tab.Screen name="Home page" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === 'admin' && <Tab.Screen name="Admin" component={AdminScreen} />}
    </Tab.Navigator>
  );
}

/**
 * Composant racine qui choisit la stack selon l'état d'authentification
 * - si user === null : on montre une stack d'auth (ici ProfileScreen uniquement)
 * - sinon : on affiche l'application (les tabs)
 */
function RootNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen
            name="AuthProfile"
            component={ConnexionScreen}
          />
        </AuthStack.Navigator>
      ) : (
        <RootStack.Navigator>
          {/* APP NORMALE AVEC TABS */}
          <RootStack.Screen
            name="MainTabs"
            component={AppTabs}
            options={{ headerShown: false }}
          />

          {/* PROFIL D'UN AUTRE UTILISATEUR (SANS TABS) */}
          <RootStack.Screen
            name="UserProfile"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
