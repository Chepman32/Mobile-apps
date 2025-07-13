import { MMKV } from 'react-native-mmkv';
import Realm from 'realm';

export const storage = new MMKV();

const DrawingSchema: Realm.ObjectSchema = {
  name: 'Drawing',
  properties: {
    id: 'string',
    strokes: 'string',
  },
};

export function openRealm() {
  return new Realm({ schema: [DrawingSchema] });
}
