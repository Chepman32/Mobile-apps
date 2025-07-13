import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  tags: string[];
};

export default function TagList({ tags }: Props) {
  return (
    <View>
      {tags.map(tag => (
        <Text key={tag}>{tag}</Text>
      ))}
    </View>
  );
}
