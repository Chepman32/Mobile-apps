import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList } from '../types/app-navigation';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@context/ThemeContext';
import HomeStack from './stacks/HomeStack';
import DiscoverStack from './stacks/DiscoverStack';
import LibraryStack from './stacks/LibraryStack';
import ProfileStack from './stacks/ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'DiscoverTab') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'LibraryTab') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingTop: 8,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="DiscoverTab" 
        component={DiscoverStack} 
        options={{ title: 'Discover' }}
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryStack} 
        options={{ title: 'Library' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
