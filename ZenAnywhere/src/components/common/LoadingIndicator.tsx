import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface LoadingIndicatorProps {
  size?: 'small' | 'large' | number;
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
  message?: string;
  messageStyle?: any;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color,
  style,
  fullScreen = false,
  message,
  messageStyle,
}) => {
  const { colors } = useTheme();
  const indicatorColor = color || colors.primary;

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={size} color={indicatorColor} />
        {message && <Text style={[styles.message, { color: colors.text }, messageStyle]}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={indicatorColor} />
      {message && <Text style={[styles.message, { color: colors.text }, messageStyle]}>{message}</Text>}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
};

export default LoadingIndicator;
