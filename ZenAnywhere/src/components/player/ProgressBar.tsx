import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder, GestureResponderEvent, PanResponderGestureState, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  height?: number;
  color?: string;
  unfilledColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  style?: ViewStyle;
  onSlidingStart?: () => void;
  onSlidingComplete?: (value: number) => void;
  onValueChange?: (value: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  height = 4,
  color,
  unfilledColor,
  borderWidth = 0,
  borderColor,
  borderRadius = 2,
  style,
  onSlidingStart,
  onSlidingComplete,
  onValueChange,
}) => {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const isSliding = useRef(false);
  const progressAnim = useRef(new Animated.Value(progress)).current;
  
  // Default colors from theme
  const progressColor = color || theme.colors.primary;
  const defaultUnfilledColor = unfilledColor || `${theme.colors.border}80`;
  const defaultBorderColor = borderColor || theme.colors.border;
  
  // Update animation when progress changes (if not being dragged)
  useEffect(() => {
    if (!isSliding.current) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, progressAnim]);
  
  // Handle container layout
  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  
  // Convert touch position to progress value
  const getProgressFromTouch = (pageX: number, containerX: number) => {
    const position = Math.max(0, pageX - containerX);
    return Math.min(1, Math.max(0, position / containerWidth));
  };
  
  // Pan responder for handling touch interactions
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        isSliding.current = true;
        onSlidingStart?.();
      },
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (containerWidth > 0) {
          const newProgress = getProgressFromTouch(
            e.nativeEvent.pageX,
            e.nativeEvent.locationX - gestureState.dx
          );
          progressAnim.setValue(newProgress);
          onValueChange?.(newProgress);
        }
      },
      onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (containerWidth > 0) {
          const newProgress = getProgressFromTouch(
            e.nativeEvent.pageX,
            e.nativeEvent.locationX - gestureState.dx
          );
          progressAnim.setValue(newProgress);
          onSlidingComplete?.(newProgress);
        }
        isSliding.current = false;
      },
      onPanResponderTerminate: () => {
        isSliding.current = false;
      },
    })
  ).current;
  
  // Calculate the width of the filled progress
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          height: height + (borderWidth * 2),
          borderRadius: borderRadius + borderWidth,
          borderWidth,
          borderColor: borderColor ? borderColor : 'transparent',
          backgroundColor: 'transparent',
        },
        style,
      ]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      {/* Background (unfilled) */}
      <View 
        style={[
          styles.progressBackground, 
          { 
            backgroundColor: defaultUnfilledColor,
            height,
            borderRadius,
          },
        ]} 
      />
      
      {/* Filled progress */}
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: progressWidth,
            backgroundColor: progressColor,
            height,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            borderTopRightRadius: progress >= 0.99 ? borderRadius : 0,
            borderBottomRightRadius: progress >= 0.99 ? borderRadius : 0,
          },
        ]}
      />
      
      {/* Thumb */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: height * 2,
              height: height * 2,
              borderRadius: height,
              backgroundColor: progressColor,
              left: Animated.subtract(
                Animated.multiply(progressAnim, containerWidth),
                height
              ),
              top: -height / 2,
              borderWidth: 2,
              borderColor: theme.colors.background,
              opacity: isSliding.current ? 1 : 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
