import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SoundJournalScreen from '../screens/SoundJournalScreen';

export type RootStackParamList = {
  SoundJournal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="SoundJournal">
      <Stack.Screen name="SoundJournal" component={SoundJournalScreen} />
    </Stack.Navigator>
  );
}
