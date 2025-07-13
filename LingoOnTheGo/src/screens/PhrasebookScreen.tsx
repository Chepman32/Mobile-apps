import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { phrases } from '../data/phrases';
const PhrasebookScreen = () => {
  const [shown, setShown] = useState<Record<number, boolean>>({});
  return (
    <View style={styles.container}>
      <FlatList
        data={phrases}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.item} onPress={() => setShown(s => ({ ...s, [index]: !s[index] }))}>
            <Text style={styles.phrase}>{item.phrase}</Text>
            {shown[index] && <Text style={styles.translation}>{item.translation}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { marginBottom: 12 },
  phrase: { fontSize: 18, fontWeight: 'bold' },
  translation: { fontSize: 16, color: '#555' },
});

export default PhrasebookScreen;
