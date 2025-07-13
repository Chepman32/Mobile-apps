import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { storage } from '../services/storage';
import { initConnection } from '../services/iap';

export default function SettingsScreen() {
  useEffect(() => {
    initConnection();
    storage.set('visited', true);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}
