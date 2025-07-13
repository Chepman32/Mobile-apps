import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/app-navigation';
import TabNavigator from './TabNavigator';
import PlayerScreen from '@screens/player/PlayerScreen';
import CategoryScreen from '@screens/discover/CategoryScreen';
import SettingsScreen from '@screens/profile/SettingsScreen';
import EditProfileScreen from '@screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="Player" 
        component={PlayerScreen}
        options={{
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
