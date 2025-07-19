
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InventoryListScreen from './src/screens/InventoryListScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import BarcodeScannerScreen from './src/screens/BarcodeScannerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InventoryList">
        <Stack.Screen name="InventoryList" component={InventoryListScreen} options={{ title: 'My Inventory' }} />
        <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add Item' }} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
