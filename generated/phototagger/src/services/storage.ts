import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export function save(key: string, value: string) {
  storage.set(key, value);
}

export function load(key: string) {
  return storage.getString(key);
}
