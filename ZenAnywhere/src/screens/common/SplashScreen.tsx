import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Text } from '@components/ui/Typography';

const SplashScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text variant="h1" style={[styles.logo, { color: colors.primary }]}>
          ZenAnywhere
        </Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        <Text variant="body2" style={{ color: colors.textSecondary, marginTop: 16 }}>
          Loading your peaceful space...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  loader: {
    marginVertical: 16,
  },
});

export default SplashScreen;
