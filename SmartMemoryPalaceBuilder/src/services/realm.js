
import Realm from 'realm';
import { MemoryItemSchema, MemoryPalaceSchema } from './schema';

export const getRealm = async () => {
  return await Realm.open({
    path: 'memoryPalace.realm',
    schema: [MemoryItemSchema, MemoryPalaceSchema],
  });
};
