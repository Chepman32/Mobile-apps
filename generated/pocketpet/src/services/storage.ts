import Realm from 'realm';

class Pet extends Realm.Object<PocketPet> {
  id!: Realm.BSON.ObjectId;
  name!: string;

  static schema = {
    name: 'Pet',
    primaryKey: 'id',
    properties: {
      id: 'objectId',
      name: 'string',
    },
  };
}

export let realm: Realm | null = null;

export function initDb() {
  realm = new Realm({ schema: [Pet] });
}

export type PocketPet = {
  id: Realm.BSON.ObjectId;
  name: string;
};
