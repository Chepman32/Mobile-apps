declare module 'expo-status-bar' {
  import * as React from 'react';
  
  export type StatusBarStyle = 'auto' | 'inverted' | 'light' | 'dark';
  
  export interface StatusBarProps {
    style?: StatusBarStyle;
    backgroundColor?: string;
    translucent?: boolean;
    hidden?: boolean;
    animated?: boolean;
  }
  
  const StatusBar: React.FC<StatusBarProps>;
  
  export default StatusBar;
}
