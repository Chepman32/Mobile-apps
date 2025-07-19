
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MindMapListScreen from './src/screens/MindMapListScreen';
import MindMapEditorScreen from './src/screens/MindMapEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MindMapList">
        <Stack.Screen name="MindMapList" component={MindMapListScreen} options={{ title: 'My Mind Maps' }} />
        <Stack.Screen name="MindMapEditor" component={MindMapEditorScreen} options={{ title: 'Edit Mind Map' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
