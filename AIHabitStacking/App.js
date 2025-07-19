
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HabitStackListScreen from './src/screens/HabitStackListScreen';
import AddHabitStackScreen from './src/screens/AddHabitStackScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HabitStackList">
        <Stack.Screen name="HabitStackList" component={HabitStackListScreen} options={{ title: 'Habit Stacks' }} />
        <Stack.Screen name="AddHabitStack" component={AddHabitStackScreen} options={{ title: 'Add Habit Stack' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
