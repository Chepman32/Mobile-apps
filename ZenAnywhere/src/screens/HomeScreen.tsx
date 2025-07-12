import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../context/SessionContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { sessions } = useContext(SessionContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zen Anywhere</Text>
      <Text style={styles.counter}>Sessions completed: {sessions}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Meditation' as never)}
      >
        <Text style={styles.buttonText}>Start Meditation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  counter: { fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default HomeScreen;
