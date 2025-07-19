
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConverterScreen from './src/screens/ConverterScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Converter">
        <Stack.Screen name="Converter" component={ConverterScreen} options={{ title: 'Unit Converter' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
