import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePalaces } from '../store/usePalaces';

export default function PalaceListScreen() {
  const navigation = useNavigation();
  const { palaces, load } = usePalaces();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPalace' as never)}
      >
        <Text style={styles.addText}>Add Palace</Text>
      </TouchableOpacity>
      <FlatList
        data={palaces}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PalaceDetail' as never, { id: item.id } as never)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addButton: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center'
  },
  addText: { color: '#fff', fontWeight: 'bold' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  itemText: { fontSize: 16 }
});
