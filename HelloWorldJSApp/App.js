import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // pour les icônes d'onglets
import HomeScreen from './screens/HomeScreen';
import GymScreen from './screens/GymScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AuthProvider } from './context/AuthContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Accueil') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Gym') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Profil') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#61dafb',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { backgroundColor: '#1e1e1e' },
          })}
        >
          <Tab.Screen name="Gym" component={GymScreen} />
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Profil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

