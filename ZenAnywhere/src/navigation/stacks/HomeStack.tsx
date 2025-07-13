import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/app-navigation';
import HomeScreen from '@screens/home/HomeScreen';
import FeaturedMeditationScreen from '@screens/home/FeaturedMeditationScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="FeaturedMeditation" 
        component={FeaturedMeditationScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
