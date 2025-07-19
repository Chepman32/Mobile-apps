
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MetronomeScreen from './src/screens/MetronomeScreen';
import PracticeRecorderScreen from './src/screens/PracticeRecorderScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Metronome">
        <Stack.Screen name="Metronome" component={MetronomeScreen} options={{ title: 'Music Practice' }} />
        <Stack.Screen name="PracticeRecorder" component={PracticeRecorderScreen} options={{ title: 'Practice Recorder' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
