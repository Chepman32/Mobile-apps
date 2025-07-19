
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResearchListScreen from './src/screens/ResearchListScreen';
import ResearchDetailScreen from './src/screens/ResearchDetailScreen';
import AddResearchScreen from './src/screens/AddResearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ResearchList">
        <Stack.Screen name="ResearchList" component={ResearchListScreen} options={{ title: 'My Research' }} />
        <Stack.Screen name="ResearchDetail" component={ResearchDetailScreen} options={({ route }) => ({ title: route.params.researchTitle })} />
        <Stack.Screen name="AddResearch" component={AddResearchScreen} options={{ title: 'Add Research' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
