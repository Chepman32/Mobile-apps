import * as RNIap from 'react-native-iap';

export const products = ['SoundJournal_PremiumFilters', 'SoundJournal_ExportPack'];

export async function initIAP() {
  try {
    await RNIap.initConnection();
  } catch (e) {
    console.warn(e);
  }
}
