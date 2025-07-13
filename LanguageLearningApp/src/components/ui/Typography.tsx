import React, { memo } from 'react';
import { Text, TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@context/ThemeContext';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'body1' 
  | 'body2' 
  | 'caption' 
  | 'button' 
  | 'overline';

type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold' | 'black';

type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

interface TypographyProps extends TextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: TextAlign;
  transform?: TextTransform;
  gutterBottom?: boolean;
  noWrap?: boolean;
  opacity?: number;
  lineHeight?: number;
  letterSpacing?: number;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  color,
  align = 'auto',
  transform = 'none',
  gutterBottom = false,
  noWrap = false,
  opacity = 1,
  lineHeight,
  letterSpacing,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  // Map variant to text styles
  const getVariantStyle = (): TextStyle => {
    const variantStyles: Record<TextVariant, TextStyle> = {
      h1: {
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: 0.25,
      },
      h2: {
        fontSize: 28,
        lineHeight: 34,
        letterSpacing: 0,
      },
      h3: {
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: 0,
      },
      h4: {
        fontSize: 20,
        lineHeight: 26,
        letterSpacing: 0.15,
      },
      h5: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.15,
      },
      body1: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
      },
      body2: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
      },
      caption: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
      },
      button: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.75,
        textTransform: 'uppercase',
      },
      overline: {
        fontSize: 10,
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      },
    };

    return variantStyles[variant] || {};
  };

  // Map weight to font family
  const getFontFamily = (): string => {
    const fontFamilies: Record<TextWeight, string> = {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
      black: 'System',
    };

    // For Android, we need to specify the font weight
    if (Platform.OS === 'android') {
      return 'sans-serif';
    }

    return fontFamilies[weight] || 'System';
  };

  // Map weight to font weight
  const getFontWeight = (): TextStyle['fontWeight'] => {
    const fontWeights: Record<TextWeight, TextStyle['fontWeight']> = {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      black: '900',
    };

    return fontWeights[weight] || '400';
  };

  const textStyle = StyleSheet.flatten([
    {
      fontFamily: getFontFamily(),
      fontWeight: getFontWeight(),
      color: color || colors.text,
      textAlign: align,
      textTransform: transform,
      opacity,
      marginBottom: gutterBottom ? 8 : 0,
      ...(noWrap && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }),
    },
    getVariantStyle(),
    lineHeight !== undefined && { lineHeight },
    letterSpacing !== undefined && { letterSpacing },
    style,
  ]);

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// Create named exports for common text variants
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="button" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

export default memo(Typography);
