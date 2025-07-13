import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@context/ThemeContext';

type TabBarIconProps = {
  name: string;
  color: string;
  size: number;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size }) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};

export default TabBarIcon;
