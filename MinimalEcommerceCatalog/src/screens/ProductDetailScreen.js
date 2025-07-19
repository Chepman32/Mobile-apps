
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Product not found.');
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCart = async () => {
    if (!product) return;
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      let cart = storedCart ? JSON.parse(storedCart) : [];
      const existingItemIndex = cart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Added to Cart', `${product.name} added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add to cart.');
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product.imageUrl && (
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      )}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>

      <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#28a745',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
