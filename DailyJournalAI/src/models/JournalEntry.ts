import Realm, { BSON } from 'realm';

export class JournalEntry extends Realm.Object<JournalEntry> {
  _id!: BSON.ObjectId;
  title!: string;
  content!: string;
  date!: Date;
  mood!: string;
  sentimentScore!: number; // -1 to 1, negative to positive
  tags!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'JournalEntry',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      content: 'string',
      date: 'date',
      mood: 'string',
      sentimentScore: 'float',
      tags: 'string[]',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

export const JournalSchema = JournalEntry.schema;