
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AnimationListScreen from './src/screens/AnimationListScreen';
import AnimationEditorScreen from './src/screens/AnimationEditorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AnimationList">
        <Stack.Screen name="AnimationList" component={AnimationListScreen} options={{ title: 'My Animations' }} />
        <Stack.Screen name="AnimationEditor" component={AnimationEditorScreen} options={{ title: 'Edit Animation' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
