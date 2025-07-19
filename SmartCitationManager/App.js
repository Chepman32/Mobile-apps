
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CitationListScreen from './src/screens/CitationListScreen';
import AddCitationScreen from './src/screens/AddCitationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CitationList">
        <Stack.Screen name="CitationList" component={CitationListScreen} options={{ title: 'Citation Manager' }} />
        <Stack.Screen name="AddCitation" component={AddCitationScreen} options={{ title: 'Add Citation' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
