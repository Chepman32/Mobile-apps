import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MeditationScreen = () => {
  const navigation = useNavigation();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.3, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(scale, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.title}>Breathing Exercise</Text>
      </View>
      <View style={styles.content}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <Text style={styles.instructions}>Breathe with the expanding circle</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: { padding: 8, marginLeft: -8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1c1c1e', marginLeft: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#a7d7c5',
  },
  instructions: { marginTop: 24, fontSize: 16, color: '#1c1c1e' },
});

export default MeditationScreen;
