import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PalaceListScreen from '../screens/PalaceListScreen';
import AddPalaceScreen from '../screens/AddPalaceScreen';
import PalaceDetailScreen from '../screens/PalaceDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Palaces: undefined;
  AddPalace: undefined;
  PalaceDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Palaces' component={PalaceListScreen} />
      <Stack.Screen name='AddPalace' component={AddPalaceScreen} />
      <Stack.Screen name='PalaceDetail' component={PalaceDetailScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
    </Stack.Navigator>
  );
}
