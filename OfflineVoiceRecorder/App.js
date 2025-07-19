
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecorderScreen from './src/screens/RecorderScreen';
import AudioListScreen from './src/screens/AudioListScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Recorder">
        <Stack.Screen name="Recorder" component={RecorderScreen} options={{ title: 'Voice Recorder' }} />
        <Stack.Screen name="AudioList" component={AudioListScreen} options={{ title: 'Audio Notes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
