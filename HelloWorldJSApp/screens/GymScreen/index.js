import * as React from 'react';
import { ScrollView,View, Image, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// import des sous-pages
import RankingScreen from './RankingScreen';
import InfoScreen from './InfoScreen';
import EventScreen from './EventScreen';
import BoulderScreen from './BoulderScreen';
import { COLORS } from '../colors';


const Tab = createMaterialTopTabNavigator();

export default function GymScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
    {/* Image ou bannière au-dessus */}
      <Image
        source={require('../../assets/photo.avif')}
        style={styles.banner}
        resizeMode="cover"
      />
      <View style={styles.tabsContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.primary,
tabBarIndicatorStyle: { backgroundColor: COLORS.primary },
tabBarStyle: { backgroundColor: COLORS.background },
            tabBarLabelStyle: { fontWeight: 'bold' },
          }}
        >
        <Tab.Screen name="Boulders" component={BoulderScreen} />
        <Tab.Screen name="Infos" component={InfoScreen} />
        <Tab.Screen name="Events" component={EventScreen} />
        <Tab.Screen name="Ranking" component={RankingScreen} />
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  banner: {
    width: '100%',
    height: 150,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  tabsContainer: {
    flex: 1,
  },
});