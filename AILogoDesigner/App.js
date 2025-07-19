
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogoListScreen from './src/screens/LogoListScreen';
import LogoEditorScreen from './src/screens/LogoEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogoList">
        <Stack.Screen name="LogoList" component={LogoListScreen} options={{ title: 'My Logos' }} />
        <Stack.Screen name="LogoEditor" component={LogoEditorScreen} options={{ title: 'Edit Logo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
