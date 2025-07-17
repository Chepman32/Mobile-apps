import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PuzzleScreen from '../screens/PuzzleScreen';

export type RootStackParamList = {
  Home: undefined;
  Puzzle: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Puzzle" component={PuzzleScreen} />
    </Stack.Navigator>
  );
}
