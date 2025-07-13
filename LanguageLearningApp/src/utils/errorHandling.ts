import { Alert } from 'react-native';
import { captureException } from '@sentry/react-native';

type ErrorContext = {
  component: string;
  method: string;
  params?: Record<string, unknown>;
};

export class AppError extends Error {
  userMessage: string;
  context: ErrorContext;
  originalError?: Error;

  constructor(
    message: string, 
    userMessage: string, 
    context: ErrorContext,
    originalError?: Error
  ) {
    super(message);
    this.userMessage = userMessage;
    this.context = context;
    this.originalError = originalError;
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, fallbackMessage = 'An unexpected error occurred'): void => {
  // Log the error to Sentry
  captureException(error);
  
  // Extract user-friendly message
  const message = error instanceof AppError 
    ? error.userMessage 
    : fallbackMessage;

  // Show user-friendly alert
  Alert.alert('Error', message);

  // Log detailed error in development
  if (__DEV__) {
    console.error('Error details:', error);
  }
};

export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context: ErrorContext,
  userMessage?: string
) => {
  return async (...args: T): Promise<R | void> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = new AppError(
        error instanceof Error ? error.message : 'Unknown error',
        userMessage || 'An error occurred while processing your request',
        context,
        error instanceof Error ? error : undefined
      );
      
      handleError(appError);
      throw appError;
    }
  };
};

// Error boundaries for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    captureException(error, { extra: { errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong. Please restart the app.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
