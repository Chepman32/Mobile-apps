
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WritingScreen from './src/screens/WritingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Writing">
        <Stack.Screen name="Writing" component={WritingScreen} options={{ title: 'AI Writing Assistant' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
