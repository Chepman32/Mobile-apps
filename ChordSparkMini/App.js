
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChordLibraryScreen from './src/screens/ChordLibraryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChordLibrary">
        <Stack.Screen name="ChordLibrary" component={ChordLibraryScreen} options={{ title: 'ChordSpark Mini' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
