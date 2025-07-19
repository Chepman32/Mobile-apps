
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PalaceListScreen from './src/screens/PalaceListScreen';
import PalaceDetailScreen from './src/screens/PalaceDetailScreen';
import CameraScreen from './src/screens/CameraScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PalaceList">
        <Stack.Screen name="PalaceList" component={PalaceListScreen} options={{ title: 'Memory Palaces' }} />
        <Stack.Screen name="PalaceDetail" component={PalaceDetailScreen} options={{ title: 'Palace Details' }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Capture Location' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
