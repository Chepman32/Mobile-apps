import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useStore } from '../store/useStore';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const increment = useStore(state => state.increment);
  const count = useStore(state => state.count);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>MindfulMoments</Text>
      <Text>Sessions: {count}</Text>
      <Button title="Add Session" onPress={increment} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
