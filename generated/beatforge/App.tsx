import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AudioService } from './src/services/audioEngine';
import { DatabaseService } from './src/services/storage';

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await DatabaseService.initialize();
      await AudioService.initialize();
      console.log('BeatForge initialized successfully');
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}