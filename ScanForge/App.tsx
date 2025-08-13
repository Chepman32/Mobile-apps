import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider } from './src/context/AppContext';
import DocumentsScreen from './src/screens/DocumentsScreen';
import ScanScreen from './src/screens/ScanScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;
                if (route.name === 'Documents') {
                  iconName = focused ? 'document' : 'document-outline';
                } else if (route.name === 'Scan') {
                  iconName = focused ? 'camera' : 'camera-outline';
                } else {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Documents" component={DocumentsScreen} />
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}
