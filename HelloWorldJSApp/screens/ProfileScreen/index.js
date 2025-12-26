import React, {useContext} from 'react';
import { ScrollView,View, Image, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

// import des sous-pages
import HistoryScreen from './HistoryScreen';
import StatisticScreen from './StatisticScreen';
import { AuthContext } from '../../context/AuthContext';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen() {
  const {user, token} = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bande supérieure */}
      <View style={styles.header}>
        <View>
          <Text style={styles.username}>{user.display_name}</Text>
          <Text style={styles.subtitle}>
            Climber since {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#61dafb',
            tabBarIndicatorStyle: { backgroundColor: '#61dafb' },
            tabBarStyle: { backgroundColor: '#1e1e1e' },
            tabBarLabelStyle: { fontWeight: 'bold' },
          }}
        >
        <Tab.Screen name="Statistic" component={StatisticScreen} />
        <Tab.Screen name="History" component={HistoryScreen} /> 
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
