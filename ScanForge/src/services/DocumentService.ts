export interface Document {
  id: string;
  title: string;
  createdAt: string;
}

const documents: Document[] = [];

export const DocumentService = {
  getAll(): Document[] {
    return documents;
  },
  add(doc: Document) {
    documents.push(doc);
  },
};
