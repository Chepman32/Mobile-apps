
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './src/screens/TaskListScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Daily Planner' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add New Task' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar View' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Productivity Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
