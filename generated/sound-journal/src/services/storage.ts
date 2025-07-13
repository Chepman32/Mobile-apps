import * as FileSystem from 'react-native-fs';
import * as SQLite from 'expo-sqlite';
import * as Keychain from 'react-native-keychain';

const db = SQLite.openDatabase('soundjournal.db');

export function setup() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS recordings (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT);'
    );
  });
}

export async function saveRecording(uri: string) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO recordings (uri) values (?)', [uri]);
  });
  const creds = await Keychain.getGenericPassword();
  if (!creds) {
    await Keychain.setGenericPassword('user', 'pass');
  }
  await FileSystem.copyFile(uri, `${FileSystem.DocumentDirectoryPath}/${Date.now()}.m4a`);
}
