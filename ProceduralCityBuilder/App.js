
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CityBuilderScreen from './src/screens/CityBuilderScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CityBuilder">
        <Stack.Screen name="CityBuilder" component={CityBuilderScreen} options={{ title: 'Procedural City Builder' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
