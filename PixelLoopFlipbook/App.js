
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectListScreen from './src/screens/ProjectListScreen';
import AnimationEditorScreen from './src/screens/AnimationEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProjectList">
        <Stack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: 'PixelLoop Flipbook' }} />
        <Stack.Screen name="AnimationEditor" component={AnimationEditorScreen} options={{ title: 'Animation Editor' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
