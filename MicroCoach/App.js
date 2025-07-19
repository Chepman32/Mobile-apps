
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Micro-Coach' }} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ title: 'Add New Habit' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
