import * as RNIap from 'react-native-iap';

export const products = ['add_tag_pack', 'pro_search_filters'];

export async function initConnection() {
  return RNIap.initConnection();
}

export async function getProducts() {
  return RNIap.getProducts(products);
}
