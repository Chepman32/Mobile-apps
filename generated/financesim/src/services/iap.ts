import * as RNIap from 'react-native-iap';

export const products = ['dataPack2000s', 'proAnalytics'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
