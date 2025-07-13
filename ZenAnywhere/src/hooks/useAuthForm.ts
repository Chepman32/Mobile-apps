import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from './useAuthState';
import { LoginCredentials, RegistrationData } from '@types/user';
import { validateEmail, validatePassword, validateName } from '@utils/validation';

interface AuthFormState {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  rememberMe: boolean;
  acceptTerms: boolean;
  marketingOptIn: boolean;
}

interface AuthFormErrors {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  general?: string;
}

const initialState: AuthFormState = {
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  rememberMe: false,
  acceptTerms: false,
  marketingOptIn: false,
};

const useAuthForm = (formType: 'login' | 'signup' | 'reset') => {
  const [formData, setFormData] = useState<AuthFormState>(initialState);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuthState();
  const navigation = useNavigation();

  // Handle input changes
  const handleChange = useCallback((field: keyof AuthFormState, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof AuthFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: AuthFormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation for login/signup
    if (formType !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Confirm password for signup
      if (formType === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        // Name validation for signup
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        } else if (!validateName(formData.name)) {
          newErrors.name = 'Please enter a valid name';
        }

        // Terms acceptance for signup
        if (!formData.acceptTerms) {
          newErrors.general = 'You must accept the terms and conditions';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, formType]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (formType === 'login') {
        await signIn(formData.email, formData.password);
        // Navigation handled by auth state change
      } else if (formType === 'signup') {
        await signUp(formData.email, formData.password, formData.name);
        // Show welcome message
        Alert.alert(
          'Welcome to ZenAnywhere!',
          'Your account has been created successfully. Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
        );
      } else if (formType === 'reset') {
        await resetPassword(formData.email);
        Alert.alert(
          'Password Reset',
          'If an account exists with this email, you will receive a password reset link.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle common auth errors
      let errorMessage = 'An error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account already exists with this email.';
          setErrors(prev => ({ ...prev, email: errorMessage }));
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          setErrors(prev => ({ ...prev, email: errorMessage }));
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          setErrors(prev => ({ ...prev, password: errorMessage }));
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          setErrors(prev => ({ ...prev, general: errorMessage }));
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          setErrors(prev => ({ ...prev, general: errorMessage }));
          break;
        default:
          setErrors(prev => ({ ...prev, general: errorMessage }));
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, formType, validateForm, signIn, signUp, resetPassword, navigation]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useAuthForm;
