
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PlantListScreen from './src/screens/PlantListScreen';
import AddPlantScreen from './src/screens/AddPlantScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PlantList">
        <Stack.Screen name="PlantList" component={PlantListScreen} options={{ title: 'My Garden' }} />
        <Stack.Screen name="AddPlant" component={AddPlantScreen} options={{ title: 'Add New Plant' }} />
        <Stack.Screen name="PlantDetail" component={PlantDetailScreen} options={{ title: 'Plant Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
