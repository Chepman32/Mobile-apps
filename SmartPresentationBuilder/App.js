
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PresentationListScreen from './src/screens/PresentationListScreen';
import PresentationEditorScreen from './src/screens/PresentationEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PresentationList">
        <Stack.Screen name="PresentationList" component={PresentationListScreen} options={{ title: 'My Presentations' }} />
        <Stack.Screen name="PresentationEditor" component={PresentationEditorScreen} options={{ title: 'Edit Presentation' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
