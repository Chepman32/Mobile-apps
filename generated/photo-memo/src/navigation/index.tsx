import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';

export type RootStackParamList = {
  Gallery: undefined;
  Camera: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Gallery">
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
}
