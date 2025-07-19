
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SketchPadScreen from './src/screens/SketchPadScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SketchPad">
        <Stack.Screen name="SketchPad" component={SketchPadScreen} options={{ title: 'SketchFlow Pad' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
