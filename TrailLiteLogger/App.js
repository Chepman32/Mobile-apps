
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TrackScreen from './src/screens/TrackScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Track">
        <Stack.Screen name="Track" component={TrackScreen} options={{ title: 'TrailLite Logger' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Track History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
