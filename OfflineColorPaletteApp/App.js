
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PaletteListScreen from './src/screens/PaletteListScreen';
import ColorPickerScreen from './src/screens/ColorPickerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaletteList">
        <Stack.Screen name="PaletteList" component={PaletteListScreen} options={{ title: 'Color Palettes' }} />
        <Stack.Screen name="ColorPicker" component={ColorPickerScreen} options={{ title: 'Pick Color' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
