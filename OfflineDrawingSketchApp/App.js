
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawingCanvasScreen from './src/screens/DrawingCanvasScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DrawingCanvas">
        <Stack.Screen name="DrawingCanvas" component={DrawingCanvasScreen} options={{ title: 'SketchFlow Pad' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
