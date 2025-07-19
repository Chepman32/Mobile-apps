
export const MindMapNodeSchema = {
  name: 'MindMapNode',
  properties: {
    _id: 'objectId',
    text: 'string',
    x: 'int',
    y: 'int',
    parentId: 'objectId?',
    mindMapId: 'objectId',
  },
};

export const MindMapSchema = {
  name: 'MindMap',
  properties: {
    _id: 'objectId',
    name: 'string',
    createdAt: 'date',
    isPremium: 'bool',
  },
};
