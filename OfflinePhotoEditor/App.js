
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Offline Photo Editor' }} />
        <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Edit Photo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
