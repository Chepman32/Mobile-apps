
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ResultScreen = ({ route }) => {
  const { scanResult } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Result:</Text>
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{scanResult}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
    lineHeight: 24,
  },
});

export default ResultScreen;
