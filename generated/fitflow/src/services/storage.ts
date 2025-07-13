import Realm from 'realm';

export type RoutineType = {
  id: Realm.BSON.ObjectId;
  name: string;
  data: string;
};

class Routine extends Realm.Object<RoutineType> {
  id!: Realm.BSON.ObjectId;
  name!: string;
  data!: string;

  static schema = {
    name: 'Routine',
    primaryKey: 'id',
    properties: {
      id: 'objectId',
      name: 'string',
      data: 'string'
    }
  };
}

export let realm: Realm | null = null;

export function initDb() {
  realm = new Realm({ schema: [Routine] });
}
