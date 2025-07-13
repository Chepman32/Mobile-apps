import React, { forwardRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
  StyleSheet,
  TextInputFocusEventData,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

export interface AppInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  showError?: boolean;
  variant?: 'default' | 'outline' | 'underline' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const AppInput = forwardRef<RNTextInput, AppInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      showError = true,
      variant = 'outline',
      size = 'medium',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        width: '100%',
        marginBottom: 8,
      };

      return { ...baseStyle, ...(containerStyle as object) };
    };

    const getInputContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
      };

      const sizeStyles: Record<string, ViewStyle> = {
        small: { height: 40, paddingVertical: 8 },
        medium: { height: 48, paddingVertical: 12 },
        large: { height: 56, paddingVertical: 16 },
      };

      const variantStyles = {
        default: {
          borderColor: colors.border,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0,
        },
        outline: {
          borderColor: isFocused ? colors.primary : colors.border,
          borderWidth: 1,
        },
        underline: {
          borderColor: isFocused ? colors.primary : colors.border,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0,
        },
        filled: {
          backgroundColor: colors.card,
          borderColor: isFocused ? colors.primary : 'transparent',
        },
      };

      const errorStyle = error
        ? {
            borderColor: colors.danger,
          }
        : {};

      return {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...errorStyle,
      };
    };

    const getInputStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        flex: 1,
        color: colors.text,
        padding: 0,
        margin: 0,
        fontSize: 16,
      };

      const sizeStyles: Record<string, TextStyle> = {
        small: { fontSize: 14 },
        medium: { fontSize: 16 },
        large: { fontSize: 18 },
      };

      return {
        ...baseStyle,
        ...sizeStyles[size],
      };
    };

    const getLabelStyle = (): TextStyle => ({
      color: colors.text,
      marginBottom: 4,
      fontWeight: '500',
      ...(labelStyle as object),
    });

    const getErrorStyle = (): TextStyle => ({
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
      ...(errorStyle as object),
    });

    return (
      <View style={getContainerStyle()}>
        {label && <Text style={getLabelStyle()}>{label}</Text>}
        <View style={getInputContainerStyle()}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <RNTextInput
            ref={ref}
            style={[getInputStyle(), inputStyle]}
            placeholderTextColor={colors.placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
        {showError && error && <Text style={getErrorStyle()}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppInput;
