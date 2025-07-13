import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/app-navigation';
import ProfileScreen from '@screens/profile/ProfileScreen';
import EditProfileScreen from '@screens/profile/EditProfileScreen';
import SettingsScreen from '@screens/profile/SettingsScreen';
import NotificationSettingsScreen from '@screens/profile/NotificationSettingsScreen';
import SubscriptionScreen from '@screens/profile/SubscriptionScreen';
import HelpCenterScreen from '@screens/profile/HelpCenterScreen';
import AboutScreen from '@screens/profile/AboutScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
