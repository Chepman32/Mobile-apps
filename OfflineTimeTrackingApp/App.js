
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './src/screens/TaskListScreen';
import TimeTrackerScreen from './src/screens/TimeTrackerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Time Tracker' }} />
        <Stack.Screen name="TimeTracker" component={TimeTrackerScreen} options={{ title: 'Track Time' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
