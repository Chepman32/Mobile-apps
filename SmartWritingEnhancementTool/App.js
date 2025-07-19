
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WritingEditorScreen from './src/screens/WritingEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WritingEditor">
        <Stack.Screen name="WritingEditor" component={WritingEditorScreen} options={{ title: 'Writing Assistant' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
