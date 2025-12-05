import * as React from 'react';
import { ScrollView,View, Image, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// import des sous-pages
import HistoryScreen from './HistoryScreen';
import StatisticScreen from './StatisticScreen';

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen() {
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