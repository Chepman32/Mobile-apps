import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Pressable, PressableProps } from 'react-native';
import { useTheme } from '@context/ThemeContext';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

export interface CardProps extends PressableProps {
  variant?: CardVariant;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  fullWidth?: boolean;
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  style,
  contentStyle,
  onPress,
  disabled = false,
  activeOpacity = 0.7,
  rounded = 'md',
  shadow = 'md',
  borderWidth: customBorderWidth,
  borderColor: customBorderColor,
  backgroundColor: customBackgroundColor,
  fullWidth = false,
  ...props
}) => {
  const { colors } = useTheme();
  
  const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  }[rounded];

  const shadowStyles = (() => {
    if (variant !== 'elevated' && shadow === 'none') return {};
    
    const shadowConfig = {
      none: {},
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
      },
    }[shadow];

    return variant === 'elevated' ? shadowConfig : {};
  })();

  const getVariantStyles = () => {
    const base = {
      backgroundColor: customBackgroundColor || colors.card,
      borderRadius,
      overflow: 'hidden',
      width: fullWidth ? '100%' : undefined,
      alignSelf: fullWidth ? 'stretch' : undefined,
    };

    const variantMap: Record<CardVariant, ViewStyle> = {
      elevated: {
        ...shadowStyles,
        backgroundColor: customBackgroundColor || colors.card,
      },
      outlined: {
        borderWidth: customBorderWidth ?? 1,
        borderColor: customBorderColor || colors.border,
        backgroundColor: customBackgroundColor || 'transparent',
      },
      filled: {
        backgroundColor: customBackgroundColor || colors.background,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return [base, variantMap[variant]];
  };

  const renderContent = () => (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          getVariantStyles(),
          { opacity: pressed ? activeOpacity : 1 },
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return (
    <View style={[getVariantStyles(), style]} {...props}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default React.memo(Card);

// Card.Header Component
const CardHeader: React.FC<{ children: ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

// Card.Footer Component
const CardFooter: React.FC<{ children: ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

// Card.Content Component
const CardContent: React.FC<{ children: ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Content = CardContent;

// Add styles for sub-components
const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export { CardHeader, CardFooter, CardContent };
