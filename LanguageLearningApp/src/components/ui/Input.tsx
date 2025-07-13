import React, { forwardRef, useState, useCallback, useImperativeHandle } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  TextInputProps as RNTextInputProps, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacity, 
  StyleProp,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Typography from './Typography';

type InputVariant = 'outlined' | 'filled' | 'underline' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  leftIconColor?: string;
  rightIconColor?: string;
  fullWidth?: boolean;
  helperText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  isRequired?: boolean;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isFocused: () => boolean;
}

const Input = forwardRef<InputRef, InputProps>(({
  variant = 'outlined',
  size = 'md',
  label,
  error,
  success = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  leftIconColor,
  rightIconColor,
  fullWidth = false,
  helperText,
  showCharacterCount = false,
  maxLength,
  isRequired = false,
  onFocus,
  onBlur,
  value,
  ...props
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<RNTextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = props.secureTextEntry;
  const hasRightIcon = Boolean(rightIcon) || isPassword;

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
    isFocused: () => inputRef.current?.isFocused() || false,
  }));

  const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  // Container styles
  const containerStyles = useCallback((): StyleProp<ViewStyle> => {
    const base: ViewStyle = {
      width: fullWidth ? '100%' : undefined,
      marginBottom: 8,
    };

    return [base, containerStyle];
  }, [fullWidth, containerStyle]);

  // Input container styles
  const inputContainerStyles = useCallback((): StyleProp<ViewStyle> => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: colors.background,
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles
    const sizeStyles: Record<InputSize, ViewStyle> = {
      sm: { height: 36, paddingHorizontal: 12 },
      md: { height: 48, paddingHorizontal: 16 },
      lg: { height: 56, paddingHorizontal: 16 },
    };

    // Variant styles
    const variantStyles: Record<InputVariant, ViewStyle> = {
      outlined: {
        borderColor: error 
          ? colors.danger 
          : success 
            ? colors.success 
            : isFocused 
              ? colors.primary 
              : colors.border,
        backgroundColor: colors.card,
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: error 
          ? `${colors.danger}10` 
          : success 
            ? `${colors.success}10` 
            : colors.background,
      },
      underline: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderRadius: 0,
        borderColor: error 
          ? colors.danger 
          : success 
            ? colors.success 
            : isFocused 
              ? colors.primary 
              : colors.border,
        backgroundColor: 'transparent',
      },
      ghost: {
        borderWidth: 0,
        backgroundColor: 'transparent',
      },
    };

    return [base, sizeStyles[size], variantStyles[variant]];
  }, [variant, size, error, success, isFocused, colors, disabled]);

  // Input styles
  const inputStyles = useCallback((): StyleProp<TextStyle> => {
    const base: TextStyle = {
      flex: 1,
      color: colors.text,
      padding: 0,
      margin: 0,
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    };

    return [base, inputStyle];
  }, [size, colors.text, inputStyle]);

  // Label styles
  const labelStyles = useCallback((): StyleProp<TextStyle> => {
    const base: TextStyle = {
      marginBottom: 4,
      color: error 
        ? colors.danger 
        : success 
          ? colors.success 
          : isFocused 
            ? colors.primary 
            : colors.textSecondary,
    };

    return [base, labelStyle];
  }, [error, success, isFocused, colors, labelStyle]);

  // Error styles
  const errorStyles = useCallback((): StyleProp<TextStyle> => ({
    color: colors.danger,
    marginTop: 4,
    fontSize: 12,
    ...(errorStyle as object),
  }), [colors.danger, errorStyle]);

  // Helper text styles
  const helperTextStyles = useCallback((): StyleProp<TextStyle> => ({
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
  }), [colors.textSecondary]);

  // Character count styles
  const characterCountStyles = useCallback((): StyleProp<TextStyle> => ({
    alignSelf: 'flex-end',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  }), [colors.textSecondary]);

  // Render left icon
  const renderLeftIcon = useCallback(() => {
    if (!leftIcon) return null;
    
    const iconColor = leftIconColor || (
      error 
        ? colors.danger 
        : success 
          ? colors.success 
          : isFocused 
            ? colors.primary 
            : colors.textSecondary
    );

    return (
      <Ionicons 
        name={leftIcon} 
        size={20} 
        color={iconColor} 
        style={styles.leftIcon} 
      />
    );
  }, [leftIcon, leftIconColor, error, success, isFocused, colors]);

  // Render right icon
  const renderRightIcon = useCallback(() => {
    // Password visibility toggle
    if (isPassword) {
      return (
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.iconButton}
          disabled={disabled}
        >
          <Ionicons 
            name={isPasswordVisible ? 'eye-off' : 'eye'} 
            size={20} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      );
    }

    // Custom right icon
    if (rightIcon) {
      const iconColor = rightIconColor || (
        error 
          ? colors.danger 
          : success 
            ? colors.success 
            : isFocused 
              ? colors.primary 
              : colors.textSecondary
      );

      if (onRightIconPress) {
        return (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.iconButton}
            disabled={disabled}
          >
            <Ionicons name={rightIcon} size={20} color={iconColor} />
          </TouchableOpacity>
        );
      }

      return <Ionicons name={rightIcon} size={20} color={iconColor} style={styles.rightIcon} />;
    }

    return null;
  }, [
    isPassword, 
    rightIcon, 
    onRightIconPress, 
    isPasswordVisible, 
    togglePasswordVisibility, 
    rightIconColor, 
    error, 
    success, 
    isFocused, 
    colors, 
    disabled
  ]);

  return (
    <View style={containerStyles()}>
      {label && (
        <Typography 
          variant="body2" 
          style={labelStyles()}
          weight="medium"
        >
          {label}
          {isRequired && (
            <Typography variant="body2" color={colors.danger}>
              {' '}*
            </Typography>
          )}
        </Typography>
      )}
      
      <View style={inputContainerStyles()}>
        {renderLeftIcon()}
        
        <RNTextInput
          ref={inputRef}
          style={inputStyles()}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          value={value}
          secureTextEntry={isPassword && !isPasswordVisible}
          maxLength={maxLength}
          {...props}
        />
        
        {hasRightIcon && renderRightIcon()}
      </View>
      
      {error ? (
        <Typography variant="caption" style={errorStyles()}>
          {error}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" style={helperTextStyles()}>
          {helperText}
        </Typography>
      ) : null}
      
      {showCharacterCount && maxLength && (
        <Typography variant="caption" style={characterCountStyles()}>
          {value?.length || 0}/{maxLength}
        </Typography>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
});

// Create named exports for common input variants
export const OutlinedInput = forwardRef<InputRef, Omit<InputProps, 'variant'>>((props, ref) => (
  <Input ref={ref} variant="outlined" {...props} />
));

export const FilledInput = forwardRef<InputRef, Omit<InputProps, 'variant'>>((props, ref) => (
  <Input ref={ref} variant="filled" {...props} />
));

export const UnderlineInput = forwardRef<InputRef, Omit<InputProps, 'variant'>>((props, ref) => (
  <Input ref={ref} variant="underline" {...props} />
));

export const GhostInput = forwardRef<InputRef, Omit<InputProps, 'variant'>>((props, ref) => (
  <Input ref={ref} variant="ghost" {...props} />
));

export default React.memo(Input);
