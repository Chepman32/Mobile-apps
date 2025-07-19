
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StoryListScreen from './src/screens/StoryListScreen';
import StoryEditorScreen from './src/screens/StoryEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StoryList">
        <Stack.Screen name="StoryList" component={StoryListScreen} options={{ title: 'Infinite Tales' }} />
        <Stack.Screen name="StoryEditor" component={StoryEditorScreen} options={{ title: 'Story Editor' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
