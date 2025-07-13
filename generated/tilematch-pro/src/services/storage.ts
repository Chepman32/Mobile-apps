import Realm from 'realm';

export type TileSetType = {
  id: Realm.BSON.ObjectId;
  name: string;
  data: string;
};

class TileSet extends Realm.Object<TileSetType> {
  id!: Realm.BSON.ObjectId;
  name!: string;
  data!: string;

  static schema = {
    name: 'TileSet',
    primaryKey: 'id',
    properties: {
      id: 'objectId',
      name: 'string',
      data: 'string',
    },
  };
}

export let realm: Realm | null = null;

export function initDb() {
  realm = new Realm({ schema: [TileSet] });
}
