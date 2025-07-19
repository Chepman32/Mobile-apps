
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import QuestionListScreen from './src/screens/QuestionListScreen';
import QuestionDetailScreen from './src/screens/QuestionDetailScreen';
import AskQuestionScreen from './src/screens/AskQuestionScreen';
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
            <Stack.Screen name="QuestionList" component={QuestionListScreen} options={{ title: 'Q&A Forum' }} />
            <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} options={({ route }) => ({ title: route.params.questionTitle })} />
            <Stack.Screen name="AskQuestion" component={AskQuestionScreen} options={{ title: 'Ask a Question' }} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
