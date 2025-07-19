
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from './src/screens/ScanScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Scan">
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Instant Scan & Solve' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Scan Result' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
