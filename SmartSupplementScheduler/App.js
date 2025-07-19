
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SupplementListScreen from './src/screens/SupplementListScreen';
import AddSupplementScreen from './src/screens/AddSupplementScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SupplementList">
        <Stack.Screen name="SupplementList" component={SupplementListScreen} options={{ title: 'My Supplements' }} />
        <Stack.Screen name="AddSupplement" component={AddSupplementScreen} options={{ title: 'Add Supplement' }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'My Schedule' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
