import * as RNIap from 'react-native-iap';

export const products = ['ExclusiveTemplates', 'AdFreeBrowsing'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
