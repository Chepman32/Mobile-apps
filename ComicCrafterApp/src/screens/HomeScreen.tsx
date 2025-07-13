import React, { useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { ComicContext } from '../context/ComicContext';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

export default function HomeScreen({ navigation }: Props) {
  const { comics } = useContext(ComicContext);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Create Comic" onPress={() => navigation.navigate('Editor')} />
      <FlatList
        data={comics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Editor', { comicId: item.id })}>
            <Text style={{ padding: 8 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
