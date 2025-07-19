
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExamListScreen from './src/screens/ExamListScreen';
import ExamScreen from './src/screens/ExamScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ExamList">
        <Stack.Screen name="ExamList" component={ExamListScreen} options={{ title: 'Exam Simulator' }} />
        <Stack.Screen name="Exam" component={ExamScreen} options={({ route }) => ({ title: route.params.examTitle })} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Exam Results' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
