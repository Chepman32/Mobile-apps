
import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators';

export class Recipe extends Model {
  static table = 'recipes';

  @field('name') name;
  @json('ingredients', (json) => json) ingredients;
  @field('instructions') instructions;
  @field('category') category;
  @field('photo_uri') photoUri;
  @field('is_premium') isPremium;
}

export class MealPlan extends Model {
  static table = 'meal_plans';

  @field('date') date;
  @field('recipe_id') recipeId;
}
