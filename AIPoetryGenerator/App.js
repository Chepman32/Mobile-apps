
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PoetryGeneratorScreen from './src/screens/PoetryGeneratorScreen';
import SavedPoemsScreen from './src/screens/SavedPoemsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PoetryGenerator">
        <Stack.Screen name="PoetryGenerator" component={PoetryGeneratorScreen} options={{ title: 'Poetry Generator' }} />
        <Stack.Screen name="SavedPoems" component={SavedPoemsScreen} options={{ title: 'My Poems' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
