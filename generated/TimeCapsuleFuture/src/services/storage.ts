import { MMKV } from 'react-native-mmkv';
import * as SQLite from 'expo-sqlite';

export const storage = new MMKV();
const db = SQLite.openDatabase('timecapsulefuture.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS capsules (id INTEGER PRIMARY KEY NOT NULL, message TEXT, openDate TEXT)');
  });
}
