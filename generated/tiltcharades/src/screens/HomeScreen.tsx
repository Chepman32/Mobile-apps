import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    const sub = Accelerometer.addListener(({ x }) => {
      setTilt(x);
    });
    Accelerometer.setUpdateInterval(200);
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tilt: {tilt.toFixed(2)}</Text>
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
