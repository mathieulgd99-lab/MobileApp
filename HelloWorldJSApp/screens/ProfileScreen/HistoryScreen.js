import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getValidatedBoulders } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
const API_BASE = "http://192.168.190.72:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES


export default function HistoryScreen() {
  const { user, token } = useContext(AuthContext);

  const [validatedBoulders, setValidatedBoulders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // false => afficher uniquement non-archivés

  useEffect(() => {
    let mounted = true;

    async function loadBoulders() {
      setLoading(true);
      try {
        const result = await getValidatedBoulders(token);

        if (!result.error && mounted) {
          setValidatedBoulders(result.boulders);
        } else if (result.error) {
          console.log('Erreur getValidatedBoulders :', result.error);
        }
      } catch (err) {
        console.log('loadBoulders error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBoulders();

    return () => { mounted = false; };
  }, [token]);

  // Filtre selon showAll
  const visibleBoulders = showAll
    ? validatedBoulders
    : validatedBoulders.filter(b => !b.archived_at); // archived_at === null => non archivé

  const toggleShowAll = () => setShowAll(prev => !prev);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}> Grade: {item.grade}</Text>
      <Text style={styles.itemSub}>Zone: {item.zone_id}</Text>
      <Text style={styles.itemSub}>
        { item.archived_at ? `Archived : ${item.archived_at}` : 'Current' }
      </Text>
      <Image source={{ uri: `${API_BASE}/${item.path}` }} style={[styles.image, {borderColor: item.color}]}/>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Validated boulders</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={toggleShowAll}
          style={[styles.toggleButton, showAll ? styles.toggleOn : styles.toggleOff]}
        >
          <Text style={styles.toggleText}>
            {showAll ? 'Show : Everything' : 'Show : Current only'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.count}>
          {visibleBoulders.length} / {validatedBoulders.length}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        // <FlatList
        //   data={visibleBoulders}
        //   keyExtractor={(item) => String(item.id)}
        //   renderItem={renderItem}
        //   contentContainerStyle={styles.list}
        //   ListEmptyComponent={<Text style={styles.empty}>Aucun boulder trouvé.</Text>}
        // />

        <FlatList
        data={visibleBoulders}
        renderItem={renderItem}
        keyExtractor={(boulder) => boulder.id}
        scrollEnabled={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.empty}>No boulder validated.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    color: 'white',
    fontSize: 18,
    marginBottom: 12,
    alignSelf: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  toggleOn: {
    backgroundColor: '#4CAF50',
  },
  toggleOff: {
    backgroundColor: '#BDBDBD',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
  count: {
    color: 'white',
    fontSize: 14,
  },
  list: {
    paddingBottom: 40,
  },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    color: 'white',
    fontWeight: '700',
  },
  itemSub: {
    color: '#cccccc',
    marginTop: 4,
  },
  empty: {
    color: 'white',
    alignSelf: 'center',
  },
})
