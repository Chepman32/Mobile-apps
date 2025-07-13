import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ComicProvider } from './src/context/ComicContext';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';
import { RootStackParamList } from './src/types';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ComicProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ComicCrafter' }} />
          <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit Comic' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ComicProvider>
  );
}
