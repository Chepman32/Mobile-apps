
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FontListScreen from './src/screens/FontListScreen';
import FontEditorScreen from './src/screens/FontEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FontList">
        <Stack.Screen name="FontList" component={FontListScreen} options={{ title: 'My Fonts' }} />
        <Stack.Screen name="FontEditor" component={FontEditorScreen} options={{ title: 'Edit Font' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
