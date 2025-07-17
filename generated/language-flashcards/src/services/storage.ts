import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema, tableSchema } from '@nozbe/watermelondb';

const adapter = new SQLiteAdapter({
  schema: appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: 'flashcards',
        columns: [
          { name: 'term', type: 'string' },
          { name: 'definition', type: 'string' },
        ],
      }),
    ],
  }),
});

export const database = new Database({ adapter });
