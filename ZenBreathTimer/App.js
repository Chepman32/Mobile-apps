
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TimerScreen from './src/screens/TimerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Timer">
        <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Zen-Breath Timer' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
