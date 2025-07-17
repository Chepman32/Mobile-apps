import React from 'react';
import { View, Text, Button, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { storage } from '../services/storage';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onShare = async () => {
    await Share.share({ message: `FitnessAI: ${storage.getNumber('score') || 0}` });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>FitnessAI</Text>
      <Button title="Share" onPress={onShare} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
