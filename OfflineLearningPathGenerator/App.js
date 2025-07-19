
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LearningPathScreen from './src/screens/LearningPathScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LearningPath">
        <Stack.Screen name="LearningPath" component={LearningPathScreen} options={{ title: 'Learning Path Generator' }} />
        <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={({ route }) => ({ title: route.params.courseTitle })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
