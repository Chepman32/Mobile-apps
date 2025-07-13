import * as RNIap from 'react-native-iap';

export const products = ['AdvancedTemplates', 'ExportPack'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
