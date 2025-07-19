
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SurveyListScreen from './src/screens/SurveyListScreen';
import CreateSurveyScreen from './src/screens/CreateSurveyScreen';
import TakeSurveyScreen from './src/screens/TakeSurveyScreen';
import SurveyResultsScreen from './src/screens/SurveyResultsScreen';
import { firebaseConfig } from './src/services/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Group>
            <Stack.Screen name="SurveyList" component={SurveyListScreen} options={{ title: 'My Surveys' }} />
            <Stack.Screen name="CreateSurvey" component={CreateSurveyScreen} options={{ title: 'Create Survey' }} />
            <Stack.Screen name="TakeSurvey" component={TakeSurveyScreen} options={({ route }) => ({ title: route.params.surveyTitle })} />
            <Stack.Screen name="SurveyResults" component={SurveyResultsScreen} options={({ route }) => ({ title: `${route.params.surveyTitle} Results` })} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
