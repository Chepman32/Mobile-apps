
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TripListScreen from './src/screens/TripListScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import AddTripScreen from './src/screens/AddTripScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TripList">
        <Stack.Screen name="TripList" component={TripListScreen} options={{ title: 'My Travel Journal' }} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: 'Trip Details' }} />
        <Stack.Screen name="AddTrip" component={AddTripScreen} options={{ title: 'Plan New Trip' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
