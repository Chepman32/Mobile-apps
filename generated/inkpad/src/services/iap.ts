import * as RNIap from 'react-native-iap';

export const products = ['AdvancedExport', 'FontPackPro'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
