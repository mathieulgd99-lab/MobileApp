import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useBoulders from '../Hooks/useBoulder';
import { AuthContext } from '../../context/AuthContext';
import styles from '../styles';

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
        style={styles.ranking_userCard}
        onPress={() => onPress(user)}
        activeOpacity={0.8}
      >
        <Text style={styles.ranking_userName}>{user.display_name}</Text>
        <Text style={styles.ranking_userPoints}>{user.total_points} pts</Text>
      </TouchableOpacity>

      {/* Marche du podium */}
      <View style={[styles.ranking_podiumStep, blockStyle, { height }]} />
    </View>
  );
}


function LeaderRow({ index, item, onPress }) {
  return (
    <TouchableOpacity style={styles.ranking_row} onPress={() => onPress(item)} activeOpacity={0.7}>
      <Text style={styles.ranking_rowRank}>{index + 4}</Text>
      <View style={styles.ranking_rowInfo}>
        <Text style={styles.ranking_rowName}>{item.display_name}</Text>
      </View>
      <Text style={styles.ranking_rowPoints}>{formatPoints(item.total_points)} pts</Text>
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
    navigation.navigate('Profile', { userId: user.id });
  };

  const sorted = [...users].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const maxPoints = top3.length > 0 ? Math.max(...top3.map(u => u.total_points || 0)) : 0;

  if (loading) {
    return (
      <View style={styles.ranking_container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.ranking_loadingText}>Chargement du classement …</Text>
      </View>
    );
  }

  return (
      <View style={styles.ranking_container}>
        <Text style={styles.ranking_title}>Classement</Text>

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
          contentContainerStyle={styles.ranking_list}
          showsVerticalScrollIndicator={false}
        />
      </View>

  );
}