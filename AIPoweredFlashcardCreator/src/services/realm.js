
import Realm from 'realm';
import { FlashcardSchema, DeckSchema } from './schema';

export const getRealm = async () => {
  return await Realm.open({
    path: 'flashcardCreator.realm',
    schema: [FlashcardSchema, DeckSchema],
  });
};
