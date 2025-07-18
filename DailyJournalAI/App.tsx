import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { RealmProvider } from '@realm/react';
import { JournalEntry, JournalSchema } from './src/models/JournalEntry';
import { MainNavigator } from './src/navigation/MainNavigator';
import { SettingsProvider } from './src/context/SettingsContext';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <RealmProvider schema={[JournalSchema]}>
        <SettingsProvider>
          <MainNavigator />
        </SettingsProvider>
      </RealmProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
