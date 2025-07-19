
import Realm from 'realm';
import { MindMapNodeSchema, MindMapSchema } from './schema';

export const getRealm = async () => {
  return await Realm.open({
    path: 'mindMapping.realm',
    schema: [MindMapNodeSchema, MindMapSchema],
  });
};
