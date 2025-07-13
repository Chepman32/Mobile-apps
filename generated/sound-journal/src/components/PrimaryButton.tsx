import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Button mode="contained" onPress={onPress} style={styles.btn}>
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  btn: { marginVertical: 8 },
});
