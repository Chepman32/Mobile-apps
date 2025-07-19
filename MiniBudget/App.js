
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WalletListScreen from './src/screens/WalletListScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WalletList">
        <Stack.Screen name="WalletList" component={WalletListScreen} options={{ title: 'MiniBudget' }} />
        <Stack.Screen name="TransactionList" component={TransactionListScreen} options={{ title: 'Transactions' }} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
