
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import PhraseListScreen from './src/screens/PhraseListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pocket Polyglot' }} />
        <Stack.Screen name="PhraseList" component={PhraseListScreen} options={{ title: 'Phrases' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
