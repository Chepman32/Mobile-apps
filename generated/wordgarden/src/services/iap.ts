import * as RNIap from 'react-native-iap';

export const products = ['seedPackCommon', 'proBloomThemes'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
