
////
// 
// 
// 
//     PULL APRES COMMIT AVANT DE PUSH
// 
// 
// 
// 
import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useBoulders from '../Hooks/useBoulder';
import { AuthContext } from '../../context/AuthContext';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatPoints(p) {
  if (p == null) return '0';
  // affiche en entier si c'est entier sinon 1 décimale
  return Number.isInteger(p) ? `${p}` : `${p.toFixed(1)}`;
}

function PodiumItem({ position, user, onPress }) {
  const PODIUM_HEIGHTS = {
    first: 100,
    second: 80,
    third: 60,
  };
  
  const height =
    position === 1
      ? PODIUM_HEIGHTS.first
      : position === 2
      ? PODIUM_HEIGHTS.second
      : PODIUM_HEIGHTS.third;

  const blockStyle =
    position === 1
      ? styles.first
      : position === 2
      ? styles.second
      : styles.third;

  return (
    <View style={styles.podiumCol}>
      {/* Carte utilisateur */}
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => onPress(user)}
        activeOpacity={0.8}
      >
        <Text style={styles.userName}>{user.display_name}</Text>
        <Text style={styles.userPoints}>{user.total_points} pts</Text>
      </TouchableOpacity>

      {/* Marche du podium */}
      <View style={[styles.podiumStep, blockStyle, { height }]} />
    </View>
  );
}


function LeaderRow({ index, item, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)} activeOpacity={0.7}>
      <Text style={styles.rowRank}>{index + 4}</Text>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{item.display_name}</Text>
      </View>
      <Text style={styles.rowPoints}>{formatPoints(item.total_points)} pts</Text>
    </TouchableOpacity>
  );
}

export default function RankingScreen() {
  const {user, token} = useContext(AuthContext);

  const navigation = useNavigation();
  const { getTotalPoint } = useBoulders();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);



  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          const res = await getTotalPoint(token);
          if (!active) return;
          setUsers(Array.isArray(res) ? res : []);
        } catch (err) {
          console.error('Error loading leaderboard', err);
          setUsers([]);
        } finally {
          if (active) setLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, [getTotalPoint])
  );

  const onPressUser = (user) => {
    if (!user) return;
    // adapte le nom 'Profile' si ton route est différente
    navigation.navigate('Profile', { userId: user.id });
  };

  const sorted = [...users].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const maxPoints = top3.length > 0 ? Math.max(...top3.map(u => u.total_points || 0)) : 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Chargement du classement …</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Classement</Text>

        <FlatList
          data={rest}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <LeaderRow index={index} item={item} onPress={onPressUser} />
          )}
          ListHeaderComponent={() => (
            <>
              <View style={styles.podium}>
                <View style={styles.podiumLeft}>
                  {top3[1] && (
                    <PodiumItem
                      position={2}
                      user={top3[1]}
                      maxPoints={maxPoints}
                      onPress={onPressUser}
                    />
                  )}
                </View>

                <View style={styles.podiumCenter}>
                  {top3[0] && (
                    <PodiumItem
                      position={1}
                      user={top3[0]}
                      maxPoints={maxPoints}
                      onPress={onPressUser}
                    />
                  )}
                </View>

                <View style={styles.podiumRight}>
                  {top3[2] && (
                    <PodiumItem
                      position={3}
                      user={top3[2]}
                      maxPoints={maxPoints}
                      onPress={onPressUser}
                    />
                  )}
                </View>
              </View>
            </>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 12,
  },

  // PODIUM
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  podiumLeft: { flex: 1, alignItems: 'center' },
  podiumCenter: { flex: 1.2, alignItems: 'center' },
  podiumRight: { flex: 1, alignItems: 'center' },

  podiumCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  podiumBlock: {
    width: SCREEN_WIDTH * 0.28,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  first: {
    backgroundColor: '#ffd700', // gold
  },
  second: {
    backgroundColor: '#c0c0c0', // silver
  },
  third: {
    backgroundColor: '#cd7f32', // bronze
  },
  podiumName: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  podiumPoints: {
    color: '#000',
    fontSize: 12,
    marginTop: 6,
  },
  podiumPos: {
    marginTop: 6,
    color: 'white',
    fontSize: 18,
  },
  emptyPodium: {
    height: 80,
  },

  // LIST
  listHeader: {
    paddingVertical: 6,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  listHeaderText: {
    color: '#aaa',
    fontSize: 13,
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: '#202020',
    borderBottomWidth: 1,
  },
  rowRank: {
    color: '#fff',
    width: 36,
    textAlign: 'center',
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  rowName: {
    color: '#fff',
    fontSize: 16,
  },
  rowPoints: {
    color: '#ccc',
    fontSize: 14,
    width: 80,
    textAlign: 'right',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  podiumStep: {
    width: SCREEN_WIDTH * 0.28,
    borderRadius: 8,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  userCard: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 6,
    minWidth: SCREEN_WIDTH * 0.28,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  
  userName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  
  userPoints: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  
});
