
export const MemoryItemSchema = {
  name: 'MemoryItem',
  properties: {
    _id: 'objectId',
    text: 'string',
    x: 'int',
    y: 'int',
    palaceId: 'objectId',
  },
};

export const MemoryPalaceSchema = {
  name: 'MemoryPalace',
  properties: {
    _id: 'objectId',
    name: 'string',
    createdAt: 'date',
    isPremium: 'bool',
  },
};
