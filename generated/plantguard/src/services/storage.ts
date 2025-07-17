import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('plantguard.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY NOT NULL, data TEXT);');
  });
}

export function saveScan(data: string) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO scans (data) values (?)', [data]);
  });
}

export function getScans(callback: (results: SQLite.SQLResultSet) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM scans', [], (_, res) => callback(res));
  });
}
