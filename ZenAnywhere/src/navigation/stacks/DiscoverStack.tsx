import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/app-navigation';
import DiscoverScreen from '@screens/discover/DiscoverScreen';
import CategoryScreen from '@screens/discover/CategoryScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const DiscoverStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default DiscoverStack;
