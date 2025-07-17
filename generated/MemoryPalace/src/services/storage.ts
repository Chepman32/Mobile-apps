import { MMKV } from 'react-native-mmkv';
import * as SQLite from 'expo-sqlite';

export const storage = new MMKV();
const db = SQLite.openDatabase('memorypalace.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS maps (id INTEGER PRIMARY KEY NOT NULL, data TEXT)');
  });
}
