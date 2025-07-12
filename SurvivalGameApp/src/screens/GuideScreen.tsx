import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DATA = [
  { id: '1', title: 'Find clean water' },
  { id: '2', title: 'Build a temporary shelter' },
  { id: '3', title: 'Start a fire safely' },
];

const GuideScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Offline Survival Guide</Text>
    <FlatList
      data={DATA}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}><Text>{item.title}</Text></View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default GuideScreen;
