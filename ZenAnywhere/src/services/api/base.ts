import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

// Helper to convert Firestore timestamps to JavaScript Date objects
const convertTimestamps = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  if (data.toDate && typeof data.toDate === 'function') {
    return data.toDate();
  }
  
  if (Array.isArray(data)) {
    return data.map(convertTimestamps);
  }
  
  const result: Record<string, any> = {};
  for (const key in data) {
    result[key] = convertTimestamps(data[key]);
  }
  
  return result;
};

// Base API class with common methods
export class BaseApiService<T> {
  protected collection: FirebaseFirestoreTypes.CollectionReference;
  
  constructor(collectionName: string) {
    this.collection = firestore().collection(collectionName);
  }
  
  // Get current user ID
  protected getCurrentUserId(): string {
    const user = auth().currentUser;
    if (!user) throw new Error('User not authenticated');
    return user.uid;
  }
  
  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const userId = this.getCurrentUserId();
    const now = firestore.FieldValue.serverTimestamp();
    
    const docRef = await this.collection.add({
      ...data,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as T;
  }
  
  // Get a document by ID
  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...convertTimestamps(doc.data()) } as T;
  }
  
  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    const now = firestore.FieldValue.serverTimestamp();
    await this.collection.doc(id).update({
      ...data,
      updatedAt: now,
    });
  }
  
  // Delete a document
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
  
  // Query documents with filters
  async query(
    where?: [string, FirebaseFirestoreTypes.WhereFilterOp, any][],
    orderBy?: [string, FirebaseFirestoreTypes.OrderByDirection],
    limit?: number
  ): Promise<T[]> {
    let query: FirebaseFirestoreTypes.Query = this.collection;
    
    if (where) {
      where.forEach(([field, op, value]) => {
        query = query.where(field, op, value);
      });
    }
    
    if (orderBy) {
      query = query.orderBy(orderBy[0], orderBy[1]);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as T[];
  }
  
  // Subscribe to real-time updates
  subscribe(
    onUpdate: (data: T[]) => void,
    where?: [string, FirebaseFirestoreTypes.WhereFilterOp, any][],
    orderBy?: [string, FirebaseFirestoreTypes.OrderByDirection],
    limit?: number
  ): () => void {
    let query: FirebaseFirestoreTypes.Query = this.collection;
    
    if (where) {
      where.forEach(([field, op, value]) => {
        query = query.where(field, op, value);
      });
    }
    
    if (orderBy) {
      query = query.orderBy(orderBy[0], orderBy[1]);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as T[];
      onUpdate(data);
    });
  }
  
  // Upload file to storage
  async uploadFile(
    filePath: string,
    fileUri: string,
    metadata: any = {}
  ): Promise<string> {
    const reference = storage().ref(filePath);
    const task = reference.putFile(Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri, metadata);
    
    await task;
    return reference.getDownloadURL();
  }
  
  // Delete file from storage
  async deleteFile(fileUrl: string): Promise<void> {
    const fileRef = storage().refFromURL(fileUrl);
    await fileRef.delete();
  }
}
