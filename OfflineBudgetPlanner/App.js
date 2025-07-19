
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BudgetOverviewScreen from './src/screens/BudgetOverviewScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import FinancialCalculatorScreen from './src/screens/FinancialCalculatorScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BudgetOverview">
        <Stack.Screen name="BudgetOverview" component={BudgetOverviewScreen} options={{ title: 'Budget Planner' }} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
        <Stack.Screen name="FinancialCalculator" component={FinancialCalculatorScreen} options={{ title: 'Calculator' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
