import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lingo On-the-Go</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Phrasebook' as never)}
      >
        <Text style={styles.buttonText}>Open Phrasebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default HomeScreen;
