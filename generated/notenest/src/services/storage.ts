import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase({ name: 'notenest.db' });
