
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SculptureListScreen from './src/screens/SculptureListScreen';
import SculptureEditorScreen from './src/screens/SculptureEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SculptureList">
        <Stack.Screen name="SculptureList" component={SculptureListScreen} options={{ title: 'My Sculptures' }} />
        <Stack.Screen name="SculptureEditor" component={SculptureEditorScreen} options={{ title: 'Edit Sculpture' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
