import SQLite from 'react-native-sqlite-storage';
import { MMKV } from 'react-native-mmkv';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

export interface DataService<T> {
  create(item: Partial<T>): Promise<string>;
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  update(id: string, updates: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  search(query: string, fields: (keyof T)[]): Promise<T[]>;
  bulkCreate(items: Partial<T>[]): Promise<string[]>;
  getByField(field: keyof T, value: any): Promise<T[]>;
  count(): Promise<number>;
  clear(): Promise<void>;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class SQLiteDataService<T extends BaseEntity> implements DataService<T> {
  private db: SQLite.SQLiteDatabase | null = null;
  private tableName: string;
  private schema: { [key: string]: string };

  constructor(tableName: string, schema: { [key: string]: string }) {
    this.tableName = tableName;
    this.schema = schema;
  }

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: `${this.tableName}.db`,
        location: 'default',
      });
      await this.createTable();
    } catch (error) {
      console.error(`Failed to initialize ${this.tableName} database:`, error);
      throw error;
    }
  }

  private async createTable(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const columns = Object.entries(this.schema)
      .map(([key, type]) => `${key} ${type}`)
      .join(', ');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        ${columns}
      )
    `;

    await this.db.executeSql(createTableSQL);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async create(item: Partial<T>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();
    
    const keys = ['id', 'created_at', 'updated_at', ...Object.keys(this.schema)];
    const values = [
      id,
      now,
      now,
      ...Object.keys(this.schema).map(key => 
        item[key as keyof T] !== undefined ? item[key as keyof T] : null
      )
    ];
    
    const placeholders = keys.map(() => '?').join(', ');
    const insertSQL = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    await this.db.executeSql(insertSQL, values);
    return id;
  }

  async getAll(): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSQL = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
    const [results] = await this.db.executeSql(selectSQL);
    
    const items: T[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(this.mapRowToEntity(results.rows.item(i)));
    }
    
    return items;
  }

  async getById(id: string): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSQL = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [results] = await this.db.executeSql(selectSQL, [id]);
    
    if (results.rows.length === 0) return null;
    
    return this.mapRowToEntity(results.rows.item(0));
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const updateFields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => updates[key as keyof T]);
    
    const updateSQL = `UPDATE ${this.tableName} SET ${updateFields}, updated_at = ? WHERE id = ?`;
    await this.db.executeSql(updateSQL, [...values, now, id]);
  }

  async delete(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteSQL = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.db.executeSql(deleteSQL, [id]);
  }

  async search(query: string, fields: (keyof T)[]): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    const searchConditions = fields
      .map(field => `${String(field)} LIKE ?`)
      .join(' OR ');
    
    const searchValues = fields.map(() => `%${query}%`);
    
    const searchSQL = `SELECT * FROM ${this.tableName} WHERE ${searchConditions} ORDER BY created_at DESC`;
    const [results] = await this.db.executeSql(searchSQL, searchValues);
    
    const items: T[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(this.mapRowToEntity(results.rows.item(i)));
    }
    
    return items;
  }

  async bulkCreate(items: Partial<T>[]): Promise<string[]> {
    const ids: string[] = [];
    for (const item of items) {
      const id = await this.create(item);
      ids.push(id);
    }
    return ids;
  }

  async getByField(field: keyof T, value: any): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSQL = `SELECT * FROM ${this.tableName} WHERE ${String(field)} = ? ORDER BY created_at DESC`;
    const [results] = await this.db.executeSql(selectSQL, [value]);
    
    const items: T[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      items.push(this.mapRowToEntity(results.rows.item(i)));
    }
    
    return items;
  }

  async count(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const countSQL = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const [results] = await this.db.executeSql(countSQL);
    
    return results.rows.item(0).count;
  }

  async clear(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const clearSQL = `DELETE FROM ${this.tableName}`;
    await this.db.executeSql(clearSQL);
  }

  private mapRowToEntity(row: any): T {
    const entity = { ...row };
    
    // Convert snake_case to camelCase
    if (entity.created_at) {
      entity.createdAt = entity.created_at;
      delete entity.created_at;
    }
    if (entity.updated_at) {
      entity.updatedAt = entity.updated_at;
      delete entity.updated_at;
    }
    
    return entity as T;
  }
}

export class MMKVDataService<T extends BaseEntity> implements DataService<T> {
  private storage: MMKV;
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.storage = new MMKV();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getItems(): T[] {
    try {
      const data = this.storage.getString(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get items from MMKV:', error);
      return [];
    }
  }

  private setItems(items: T[]): void {
    try {
      this.storage.set(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to set items in MMKV:', error);
      throw error;
    }
  }

  async create(item: Partial<T>): Promise<string> {
    const items = this.getItems();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newItem: T = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    } as T;
    
    items.push(newItem);
    this.setItems(items);
    
    return id;
  }

  async getAll(): Promise<T[]> {
    return this.getItems().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getById(id: string): Promise<T | null> {
    const items = this.getItems();
    return items.find(item => item.id === id) || null;
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) throw new Error('Item not found');
    
    items[index] = {
      ...items[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    
    this.setItems(items);
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems();
    const filtered = items.filter(item => item.id !== id);
    this.setItems(filtered);
  }

  async search(query: string, fields: (keyof T)[]): Promise<T[]> {
    const items = this.getItems();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item =>
      fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(lowerQuery);
      })
    ).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async bulkCreate(items: Partial<T>[]): Promise<string[]> {
    const ids: string[] = [];
    for (const item of items) {
      const id = await this.create(item);
      ids.push(id);
    }
    return ids;
  }

  async getByField(field: keyof T, value: any): Promise<T[]> {
    const items = this.getItems();
    return items.filter(item => item[field] === value)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async count(): Promise<number> {
    return this.getItems().length;
  }

  async clear(): Promise<void> {
    this.storage.delete(this.storageKey);
  }
} 