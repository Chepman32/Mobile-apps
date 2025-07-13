import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { RootStackParamList } from '../navigation';
import { storage } from '../services/storage';

export default function CameraScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [path, setPath] = React.useState<string | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const savePhoto = () => {
    if (!path) return;
    const existing = storage.getString('photos');
    const list = existing ? JSON.parse(existing) : [];
    list.push(path);
    storage.set('photos', JSON.stringify(list));
    navigation.goBack();
  };

  if (!device) return <View />;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive
        photo
        onPhotoCaptured={photo => setPath(photo.path)}
      />
      <Button title="Save" onPress={savePhoto} />
    </View>
  );
}
