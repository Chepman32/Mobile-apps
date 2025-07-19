
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FormulaListScreen from './src/screens/FormulaListScreen';
import FormulaDetailScreen from './src/screens/FormulaDetailScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Formulas" component={FormulaListScreen} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="FormulaDetail" component={FormulaDetailScreen} options={({ route }) => ({ title: route.params.formulaTitle })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
