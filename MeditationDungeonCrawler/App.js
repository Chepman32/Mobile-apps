
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MeditationScreen from './src/screens/MeditationScreen';
import DungeonScreen from './src/screens/DungeonScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Meditation">
        <Stack.Screen name="Meditation" component={MeditationScreen} options={{ title: 'Meditation Dungeon' }} />
        <Stack.Screen name="Dungeon" component={DungeonScreen} options={{ title: 'Dungeon Crawl' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
