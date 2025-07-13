import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/app-navigation';
import LibraryScreen from '@screens/library/LibraryScreen';
import FavoritesScreen from '@screens/library/FavoritesScreen';
import DownloadsScreen from '@screens/library/DownloadsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const LibraryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Downloads" 
        component={DownloadsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default LibraryStack;
