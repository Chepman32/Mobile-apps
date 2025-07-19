
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NoteListScreen from './src/screens/NoteListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Notes" component={NoteListScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="NoteEditor" component={NoteEditorScreen} options={{ title: 'Edit Note' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
