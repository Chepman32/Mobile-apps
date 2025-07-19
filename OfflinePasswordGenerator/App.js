
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PasswordGeneratorScreen from './src/screens/PasswordGeneratorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PasswordGenerator">
        <Stack.Screen name="PasswordGenerator" component={PasswordGeneratorScreen} options={{ title: 'Password Generator' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
