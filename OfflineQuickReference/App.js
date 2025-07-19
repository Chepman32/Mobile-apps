
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReferenceListScreen from './src/screens/ReferenceListScreen';
import ReferenceDetailScreen from './src/screens/ReferenceDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ReferenceList">
        <Stack.Screen name="ReferenceList" component={ReferenceListScreen} options={{ title: 'Quick Reference' }} />
        <Stack.Screen name="ReferenceDetail" component={ReferenceDetailScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
