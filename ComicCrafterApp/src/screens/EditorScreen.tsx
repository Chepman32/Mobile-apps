import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Comic } from '../types';
import { ComicContext } from '../context/ComicContext';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Editor'>;
  route: RouteProp<RootStackParamList, 'Editor'>;
}

export default function EditorScreen({ navigation, route }: Props) {
  const { comics, addComic } = useContext(ComicContext);
  const existing = comics.find((c) => c.id === route.params?.comicId);

  const [title, setTitle] = useState(existing?.title || '');
  const [panels, setPanels] = useState<string[]>(existing?.panels || []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(result.assets[0].uri, [], { compress: 0.8 });
      setPanels([...panels, manipResult.uri]);
    }
  };

  const saveComic = async () => {
    const comic: Comic = {
      id: existing?.id || uuidv4(),
      title,
      panels,
    };
    await addComic(comic);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Comic Title" value={title} onChangeText={setTitle} style={{ marginBottom: 12, borderBottomWidth: 1 }} />
      <Button title="Add Panel" onPress={pickImage} />
      <FlatList
        data={panels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 8 }} />}
        horizontal
      />
      <Button title="Save" onPress={saveComic} />
    </View>
  );
}
