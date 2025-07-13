import { MMKV } from 'react-native-mmkv';
import * as SQLite from 'expo-sqlite';

export const storage = new MMKV();
const db = SQLite.openDatabase('mindfulmoments.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY NOT NULL, mood TEXT)');
  });
}
