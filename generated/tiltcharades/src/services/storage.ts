import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tiltcharades.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY NOT NULL, correct INTEGER)');
  });
}
