import React, { useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { storage } from '../services/storage';

export default function GalleryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [photos, setPhotos] = React.useState<string[]>([]);

  useEffect(() => {
    const saved = storage.getString('photos');
    if (saved) setPhotos(JSON.parse(saved));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={photos}
        keyExtractor={item => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <Button title="Add" onPress={() => navigation.navigate('Camera')} />
    </View>
  );
}
