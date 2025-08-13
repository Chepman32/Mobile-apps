export interface Document {
  id: string;
  title: string;
  createdAt: string;
}

export interface Page {
  id: string;
  documentId: string;
  imagePath: string;
}
