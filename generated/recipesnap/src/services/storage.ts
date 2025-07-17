import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export function setItem(key: string, value: string) {
  storage.set(key, value);
}

export function getItem(key: string) {
  return storage.getString(key);
}
