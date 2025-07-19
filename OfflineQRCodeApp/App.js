
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QRScannerScreen from './src/screens/QRScannerScreen';
import QRGeneratorScreen from './src/screens/QRGeneratorScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QRScanner">
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'QR Code App' }} />
        <Stack.Screen name="QRGenerator" component={QRGeneratorScreen} options={{ title: 'Generate QR' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Scan/Generate History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
