import Realm from 'realm';

export type CardType = {
  id: Realm.BSON.ObjectId;
  term: string;
  definition: string;
};

class Card extends Realm.Object<CardType> {
  id!: Realm.BSON.ObjectId;
  term!: string;
  definition!: string;

  static schema = {
    name: 'Card',
    primaryKey: 'id',
    properties: {
      id: 'objectId',
      term: 'string',
      definition: 'string'
    }
  };
}

export let realm: Realm | null = null;

export function initDb() {
  realm = new Realm({ schema: [Card] });
}
