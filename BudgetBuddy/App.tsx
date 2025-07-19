import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { BudgetProvider } from './src/context/BudgetContext';
import { createTheme } from '../shared/theme/AppTheme';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import EditTransactionScreen from './src/screens/EditTransactionScreen';
import AddBudgetScreen from './src/screens/AddBudgetScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  Transactions: undefined;
  Categories: undefined;
  Budgets: undefined;
  Analytics: undefined;
  AddTransaction: { categoryId?: string };
  EditTransaction: { transactionId: string };
  AddBudget: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const theme = createTheme(false);

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <BudgetProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: 'Budget Buddy' }}
              />
              <Stack.Screen 
                name="Transactions" 
                component={TransactionsScreen}
                options={{ title: 'Transactions' }}
              />
              <Stack.Screen 
                name="Categories" 
                component={CategoriesScreen}
                options={{ title: 'Categories' }}
              />
              <Stack.Screen 
                name="Budgets" 
                component={BudgetsScreen}
                options={{ title: 'Budgets' }}
              />
              <Stack.Screen 
                name="Analytics" 
                component={AnalyticsScreen}
                options={{ title: 'Analytics' }}
              />
              <Stack.Screen 
                name="AddTransaction" 
                component={AddTransactionScreen}
                options={{ title: 'Add Transaction' }}
              />
              <Stack.Screen 
                name="EditTransaction" 
                component={EditTransactionScreen}
                options={{ title: 'Edit Transaction' }}
              />
              <Stack.Screen 
                name="AddBudget" 
                component={AddBudgetScreen}
                options={{ title: 'Add Budget' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Settings' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </BudgetProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 