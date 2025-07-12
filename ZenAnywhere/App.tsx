import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import { SessionProvider } from './src/context/SessionContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Meditation" component={MeditationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
