
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  const loadCartItems = useCallback(async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart items:', error);
    }
  }, []);

  useEffect(() => {
    loadCartItems();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartItems();
    });
    return unsubscribe;
  }, [navigation, loadCartItems]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty. Add some products first!');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email,
        items: cartItems.map(item => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        total: calculateTotal(),
        timestamp: serverTimestamp(),
        status: 'pending',
      });
      await AsyncStorage.removeItem('cart'); // Clear cart after placing order
      setCartItems([]);
      Alert.alert('Order Placed', 'Your order has been placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemDetails}>Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</Text>
      <Text style={styles.cartItemTotal}>Total: ${(item.quantity * item.price).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  cartItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
