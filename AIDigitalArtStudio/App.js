
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ArtStudioScreen from './src/screens/ArtStudioScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ArtStudio">
        <Stack.Screen name="ArtStudio" component={ArtStudioScreen} options={{ title: 'Digital Art Studio' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
