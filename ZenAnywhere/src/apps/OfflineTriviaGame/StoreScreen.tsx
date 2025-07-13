import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function StoreScreen() {
  // Placeholder: Integrate react-native-iap for real purchases
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store</Text>
      <Text style={styles.item}>Question Pack 1 - $1.99</Text>
      <Button title="Buy" onPress={() => alert('In-app purchase goes here')} />
      <Text style={styles.item}>Question Pack 2 - $1.99</Text>
      <Button title="Buy" onPress={() => alert('In-app purchase goes here')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f1f1' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  item: { fontSize: 20, marginVertical: 10 },
});
