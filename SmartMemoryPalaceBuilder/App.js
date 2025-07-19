
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PalaceListScreen from './src/screens/PalaceListScreen';
import PalaceEditorScreen from './src/screens/PalaceEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PalaceList">
        <Stack.Screen name="PalaceList" component={PalaceListScreen} options={{ title: 'Memory Palaces' }} />
        <Stack.Screen name="PalaceEditor" component={PalaceEditorScreen} options={{ title: 'Edit Palace' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
