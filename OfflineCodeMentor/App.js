
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CodeEditorScreen from './src/screens/CodeEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CodeEditor">
        <Stack.Screen name="CodeEditor" component={CodeEditorScreen} options={{ title: 'Offline Code Mentor' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
