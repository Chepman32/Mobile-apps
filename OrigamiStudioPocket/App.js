
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ModelViewScreen from './src/screens/ModelViewScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Origami Studio Pocket' }} />
        <Stack.Screen name="ModelView" component={ModelViewScreen} options={{ title: 'Model View' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
