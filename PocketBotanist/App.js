
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import IdentifyScreen from './src/screens/IdentifyScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pocket Botanist' }} />
        <Stack.Screen name="Identify" component={IdentifyScreen} options={{ title: 'Identify Plant' }} />
        <Stack.Screen name="PlantDetail" component={PlantDetailScreen} options={{ title: 'Plant Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
