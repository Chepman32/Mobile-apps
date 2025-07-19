
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DesignListScreen from './src/screens/DesignListScreen';
import DesignEditorScreen from './src/screens/DesignEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DesignList">
        <Stack.Screen name="DesignList" component={DesignListScreen} options={{ title: 'My 3D Designs' }} />
        <Stack.Screen name="DesignEditor" component={DesignEditorScreen} options={{ title: 'Edit Design' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
