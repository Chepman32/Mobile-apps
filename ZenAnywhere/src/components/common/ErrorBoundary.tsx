import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryComponent extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback({ error, errorInfo, retry: this.handleRetry }) 
          : fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>We're sorry for the inconvenience.</Text>
            {__DEV__ && error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>{error.toString()}</Text>
                {errorInfo?.componentStack && (
                  <Text style={styles.stackText}>
                    {errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return children;
  }
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    content: {
      width: '100%',
      maxWidth: 400,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      color: colors.subtext,
      textAlign: 'center',
    },
    errorDetails: {
      width: '100%',
      marginBottom: 20,
      padding: 10,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      borderRadius: 5,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    stackText: {
      color: colors.subtext,
      fontSize: 12,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    retryText: {
      color: '#fff',
      fontWeight: '600',
    },
  });

  return <ErrorBoundaryComponent {...props} />;
};

export default ErrorBoundary;
