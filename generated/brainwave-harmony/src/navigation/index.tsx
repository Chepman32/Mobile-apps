import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
export type RootStackParamList = { Home: undefined; Settings: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName=\"Home\">
      <Stack.Screen name=\"Home\" component={HomeScreen} />
      <Stack.Screen name=\"Settings\" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
