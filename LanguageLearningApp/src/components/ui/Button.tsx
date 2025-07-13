import React, { forwardRef, useMemo } from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
  children,
  ...props
}, ref) => {
  const { colors } = useTheme();
  
  const buttonStyles = useMemo(() => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 16,
      paddingVertical: size === 'sm' ? 6 : size === 'lg' ? 14 : 10,
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.danger,
      },
    };

    return [base, variantStyles[variant], style];
  }, [variant, size, disabled, fullWidth, colors, style]);

  const textStyles = useMemo(() => {
    const base: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      marginHorizontal: 4,
    };

    const sizeStyles: Record<ButtonSize, TextStyle> = {
      sm: { fontSize: 13 },
      md: { fontSize: 15 },
      lg: { fontSize: 17 },
    };

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: colors.text },
      ghost: { color: colors.primary },
      danger: { color: '#FFFFFF' },
    };

    return [base, sizeStyles[size], variantTextStyles[variant], textStyle];
  }, [variant, size, colors, textStyle]);

  const iconSize = useMemo(() => ({
    sm: 14,
    md: 16,
    lg: 20,
  }[size]), [size]);

  const iconColor = useMemo(() => {
    if (variant === 'primary' || variant === 'secondary' || variant === 'danger') {
      return '#FFFFFF';
    }
    return colors.primary;
  }, [variant, colors.primary]);

  return (
    <TouchableOpacity
      ref={ref}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size={iconSize} 
          color={iconColor} 
          style={{ marginRight: 8 }} 
        />
      ) : leftIcon ? (
        <Ionicons 
          name={leftIcon} 
          size={iconSize} 
          color={iconColor} 
          style={{ marginRight: 8 }} 
        />
      ) : null}
      
      <Text style={textStyles} numberOfLines={1}>
        {children}
      </Text>
      
      {rightIcon && !loading && (
        <Ionicons 
          name={rightIcon} 
          size={iconSize} 
          color={iconColor} 
          style={{ marginLeft: 8 }} 
        />
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

export default React.memo(Button);
