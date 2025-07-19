
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'recipes',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'ingredients', type: 'string' }, // Stored as JSON string
        { name: 'instructions', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'photo_uri', type: 'string', isOptional: true },
        { name: 'is_premium', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'meal_plans',
      columns: [
        { name: 'date', type: 'string', isIndexed: true },
        { name: 'recipe_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
