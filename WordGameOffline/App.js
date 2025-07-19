
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WordSearchScreen from './src/screens/WordSearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WordSearch">
        <Stack.Screen name="WordSearch" component={WordSearchScreen} options={{ title: 'Word Game' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
