import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { getAll } from '../services/palaceService';
import { Palace } from '../types';

export default function PalaceDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'PalaceDetail'>>();
  const [palace, setPalace] = useState<Palace | undefined>();

  useEffect(() => {
    const found = getAll().find(p => p.id === route.params.id);
    setPalace(found);
  }, [route.params.id]);

  if (!palace) {
    return (
      <View style={styles.container}>
        <Text>Palace not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{palace.name}</Text>
      {/* Location management could go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 }
});
