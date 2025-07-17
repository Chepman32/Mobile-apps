import * as RNIap from 'react-native-iap';

export const products = ['photoPuzzle_Pack1', 'photoPuzzle_Pack2'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
