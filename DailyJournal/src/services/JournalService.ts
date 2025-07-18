import SQLite from 'react-native-sqlite-storage';
import { EncryptionService } from './EncryptionService';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood?: string;
  weather?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
}

class JournalServiceClass {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'DailyJournal.db',
        location: 'default',
      });

      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createEntriesTable = `
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT,
        mood TEXT,
        weather TEXT,
        location TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        is_encrypted INTEGER DEFAULT 0
      )
    `;

    await this.db.executeSql(createEntriesTable);
  }

  async createEntry(entryData: Partial<JournalEntry>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();
    const now = new Date().toISOString();
    
    const entry: JournalEntry = {
      id,
      title: entryData.title || 'Untitled',
      content: entryData.content || '',
      tags: entryData.tags || [],
      mood: entryData.mood,
      weather: entryData.weather,
      location: entryData.location,
      createdAt: now,
      updatedAt: now,
      isEncrypted: false,
    };

    // Encrypt sensitive content if needed
    let contentToStore = entry.content;
    if (await EncryptionService.isEncryptionEnabled()) {
      contentToStore = await EncryptionService.encrypt(entry.content);
      entry.isEncrypted = true;
    }

    const insertSql = `
      INSERT INTO journal_entries 
      (id, title, content, tags, mood, weather, location, created_at, updated_at, is_encrypted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(insertSql, [
      entry.id,
      entry.title,
      contentToStore,
      JSON.stringify(entry.tags),
      entry.mood || null,
      entry.weather || null,
      entry.location || null,
      entry.createdAt,
      entry.updatedAt,
      entry.isEncrypted ? 1 : 0,
    ]);

    return id;
  }

  async getAllEntries(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSql = `
      SELECT * FROM journal_entries 
      ORDER BY created_at DESC
    `;

    const [results] = await this.db.executeSql(selectSql);
    const entries: JournalEntry[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      let content = row.content;

      // Decrypt content if encrypted
      if (row.is_encrypted && await EncryptionService.isEncryptionEnabled()) {
        try {
          content = await EncryptionService.decrypt(content);
        } catch (error) {
          console.error('Failed to decrypt entry:', error);
          content = '[Encrypted content - unable to decrypt]';
        }
      }

      entries.push({
        id: row.id,
        title: row.title,
        content,
        tags: JSON.parse(row.tags || '[]'),
        mood: row.mood,
        weather: row.weather,
        location: row.location,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isEncrypted: row.is_encrypted === 1,
      });
    }

    return entries;
  }

  async getEntryById(id: string): Promise<JournalEntry | null> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSql = `
      SELECT * FROM journal_entries 
      WHERE id = ?
    `;

    const [results] = await this.db.executeSql(selectSql, [id]);

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows.item(0);
    let content = row.content;

    // Decrypt content if encrypted
    if (row.is_encrypted && await EncryptionService.isEncryptionEnabled()) {
      try {
        content = await EncryptionService.decrypt(content);
      } catch (error) {
        console.error('Failed to decrypt entry:', error);
        content = '[Encrypted content - unable to decrypt]';
      }
    }

    return {
      id: row.id,
      title: row.title,
      content,
      tags: JSON.parse(row.tags || '[]'),
      mood: row.mood,
      weather: row.weather,
      location: row.location,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isEncrypted: row.is_encrypted === 1,
    };
  }

  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const existingEntry = await this.getEntryById(id);
    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    const updatedAt = new Date().toISOString();
    
    // Prepare updated data
    const updatedEntry = {
      ...existingEntry,
      ...updates,
      updatedAt,
    };

    // Encrypt content if needed
    let contentToStore = updatedEntry.content;
    if (await EncryptionService.isEncryptionEnabled()) {
      contentToStore = await EncryptionService.encrypt(updatedEntry.content);
      updatedEntry.isEncrypted = true;
    }

    const updateSql = `
      UPDATE journal_entries 
      SET title = ?, content = ?, tags = ?, mood = ?, weather = ?, location = ?, updated_at = ?, is_encrypted = ?
      WHERE id = ?
    `;

    await this.db.executeSql(updateSql, [
      updatedEntry.title,
      contentToStore,
      JSON.stringify(updatedEntry.tags),
      updatedEntry.mood || null,
      updatedEntry.weather || null,
      updatedEntry.location || null,
      updatedEntry.updatedAt,
      updatedEntry.isEncrypted ? 1 : 0,
      id,
    ]);
  }

  async deleteEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteSql = `DELETE FROM journal_entries WHERE id = ?`;
    await this.db.executeSql(deleteSql, [id]);
  }

  async searchEntries(query: string): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const searchSql = `
      SELECT * FROM journal_entries 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
    `;

    const searchTerm = `%${query}%`;
    const [results] = await this.db.executeSql(searchSql, [searchTerm, searchTerm]);
    const entries: JournalEntry[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      let content = row.content;

      // Decrypt content if encrypted
      if (row.is_encrypted && await EncryptionService.isEncryptionEnabled()) {
        try {
          content = await EncryptionService.decrypt(content);
        } catch (error) {
          console.error('Failed to decrypt entry:', error);
          content = '[Encrypted content - unable to decrypt]';
        }
      }

      entries.push({
        id: row.id,
        title: row.title,
        content,
        tags: JSON.parse(row.tags || '[]'),
        mood: row.mood,
        weather: row.weather,
        location: row.location,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isEncrypted: row.is_encrypted === 1,
      });
    }

    return entries;
  }

  async getEntriesByTag(tag: string): Promise<JournalEntry[]> {
    const allEntries = await this.getAllEntries();
    return allEntries.filter(entry => entry.tags.includes(tag));
  }

  async getEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectSql = `
      SELECT * FROM journal_entries 
      WHERE created_at BETWEEN ? AND ?
      ORDER BY created_at DESC
    `;

    const [results] = await this.db.executeSql(selectSql, [startDate, endDate]);
    const entries: JournalEntry[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      let content = row.content;

      if (row.is_encrypted && await EncryptionService.isEncryptionEnabled()) {
        try {
          content = await EncryptionService.decrypt(content);
        } catch (error) {
          console.error('Failed to decrypt entry:', error);
          content = '[Encrypted content - unable to decrypt]';
        }
      }

      entries.push({
        id: row.id,
        title: row.title,
        content,
        tags: JSON.parse(row.tags || '[]'),
        mood: row.mood,
        weather: row.weather,
        location: row.location,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isEncrypted: row.is_encrypted === 1,
      });
    }

    return entries;
  }

  async exportEntries(): Promise<string> {
    const entries = await this.getAllEntries();
    return JSON.stringify(entries, null, 2);
  }

  async importEntries(entriesJson: string): Promise<void> {
    try {
      const entries: JournalEntry[] = JSON.parse(entriesJson);
      
      for (const entry of entries) {
        await this.createEntry(entry);
      }
    } catch (error) {
      console.error('Failed to import entries:', error);
      throw new Error('Invalid entries format');
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalWords: number;
    averageWordsPerEntry: number;
    mostUsedTags: { tag: string; count: number }[];
    entriesThisMonth: number;
    longestStreak: number;
  }> {
    const entries = await this.getAllEntries();
    
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => {
      return sum + entry.content.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
    
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    // Count tag usage
    const tagCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Entries this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const entriesThisMonth = entries.filter(entry => 
      new Date(entry.createdAt) >= firstDayOfMonth
    ).length;
    
    // Calculate longest streak (consecutive days with entries)
    const entriesByDate = new Map<string, number>();
    entries.forEach(entry => {
      const date = new Date(entry.createdAt).toDateString();
      entriesByDate.set(date, (entriesByDate.get(date) || 0) + 1);
    });
    
    let longestStreak = 0;
    let currentStreak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const dateString = currentDate.toDateString();
      if (entriesByDate.has(dateString)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return {
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      mostUsedTags,
      entriesThisMonth,
      longestStreak,
    };
  }
}

export const JournalService = new JournalServiceClass();