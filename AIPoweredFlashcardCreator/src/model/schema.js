
export const FlashcardSchema = {
  name: 'Flashcard',
  properties: {
    _id: 'objectId',
    question: 'string',
    answer: 'string',
    interval: 'int',
    easeFactor: 'double',
    dueDate: 'string',
    deckId: 'objectId',
  },
};

export const DeckSchema = {
  name: 'Deck',
  properties: {
    _id: 'objectId',
    name: 'string',
    isPremium: 'bool',
  },
};
