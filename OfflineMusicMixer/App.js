
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MixerScreen from './src/screens/MixerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Mixer">
        <Stack.Screen name="Mixer" component={MixerScreen} options={{ title: 'Music Mixer' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
