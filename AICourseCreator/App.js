
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CourseListScreen from './src/screens/CourseListScreen';
import CourseEditorScreen from './src/screens/CourseEditorScreen';
import ModuleListScreen from './src/screens/ModuleListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CourseList">
        <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: 'My Courses' }} />
        <Stack.Screen name="CourseEditor" component={CourseEditorScreen} options={{ title: 'Edit Course' }} />
        <Stack.Screen name="ModuleList" component={ModuleListScreen} options={{ title: 'Modules' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
