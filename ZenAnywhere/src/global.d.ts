/// <reference types="react" />
/// <reference types="react-native" />

// Import our custom navigation types
import { RootStackParamList } from './types/navigation';

// Declare modules for various file types
declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.gif' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.mp3' {
  const value: any;
  export default value;
}

declare module '*.wav' {
  const value: any;
  export default value;
}

// Extend the global namespace for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }

  // This makes the global JSX namespace include our theme types
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom component types here
    }
  }
}
