import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 12,
    backgroundColor: '#16a34a',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
