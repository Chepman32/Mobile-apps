
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import PollListScreen from './src/screens/PollListScreen';
import CreatePollScreen from './src/screens/CreatePollScreen';
import PollDetailScreen from './src/screens/PollDetailScreen';
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
            <Stack.Screen name="PollList" component={PollListScreen} options={{ title: 'Public Polls' }} />
            <Stack.Screen name="CreatePoll" component={CreatePollScreen} options={{ title: 'Create New Poll' }} />
            <Stack.Screen name="PollDetail" component={PollDetailScreen} options={({ route }) => ({ title: route.params.pollQuestion })} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
