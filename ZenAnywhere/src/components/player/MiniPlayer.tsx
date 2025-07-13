import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { usePlayerState, usePlayerControls } from '@context/AudioPlayerContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { formatDuration } from '@utils/format';
import { ProgressBar } from './ProgressBar';

interface MiniPlayerProps {
  onPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { currentTrack, isPlaying, position, duration } = usePlayerState();
  const { togglePlayPause } = usePlayerControls();
  
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('Player');
    }
  }, [onPress, navigation]);
  
  const handlePlayPause = useCallback((e: any) => {
    e.stopPropagation();
    togglePlayPause();
  }, [togglePlayPause]);
  
  // Don't render if no track is playing
  if (!currentTrack) return null;
  
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={handlePress}
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Progress bar at the top */}
      <View style={styles.progressBarContainer}>
        <ProgressBar
          progress={duration > 0 ? position / duration : 0}
          height={2}
          color={theme.colors.primary}
          unfilledColor={theme.colors.border}
          borderWidth={0}
        />
      </View>
      
      <View style={styles.content}>
        {/* Thumbnail */}
        <Image 
          source={{ uri: currentTrack.artwork || 'https://via.placeholder.com/60' }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text 
            style={[styles.title, { color: theme.colors.text }]} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentTrack.title}
          </Text>
          <Text 
            style={[styles.artist, { color: theme.colors.textSecondary }]} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentTrack.artist}
          </Text>
        </View>
        
        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={handlePlayPause}
            style={styles.playButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
