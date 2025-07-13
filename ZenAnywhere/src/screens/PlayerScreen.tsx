import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';

import { usePlayerState, usePlayerControls } from '@context/AudioPlayerContext';
import { formatDuration } from '@utils/format';
import { ProgressBar } from '@components/player/ProgressBar';

const { width, height } = Dimensions.get('window');

const PlayerScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  
  const { currentTrack, isPlaying, position, duration, buffered } = usePlayerState();
  const { 
    togglePlayPause, 
    skipToNext, 
    skipToPrevious, 
    seekTo, 
    setRate, 
    setVolume 
  } = usePlayerControls();
  
  const handleSeek = useCallback((value: number) => {
    if (duration) {
      seekTo(value * duration);
    }
  }, [duration, seekTo]);
  
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  if (!currentTrack) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>No track selected</Text>
      </View>
    );
  }
          setSound(soundObject);
        }

        return () => {
          soundObject.unloadAsync();
        };
      } catch (error) {
        console.error('Error loading sound', error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const togglePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error toggling play/pause', error);
    }
  };

  const handleBack = () => {
    if (sound) {
      sound.stopAsync();
    }
    navigation.goBack();
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: 8,
    },
    backText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    artwork: {
      width: width * 0.8,
      height: width * 0.8,
      borderRadius: 20,
      backgroundColor: colors.card,
      marginBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    artworkPlaceholder: {
      fontSize: 60,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
      marginBottom: 40,
    },
    progressContainer: {
      width: '100%',
      marginBottom: 30,
    },
    progressBar: {
      width: '100%',
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: 8,
    },
    progress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    timeText: {
      color: colors.subtext,
      fontSize: 12,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    controlButton: {
      marginHorizontal: 20,
      padding: 15,
    },
    playButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    playIcon: {
      fontSize: 30,
      color: '#FFFFFF',
      marginLeft: 3,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colors.background === '#121212' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.artwork}>
          <Text style={styles.artworkPlaceholder}>🧘‍♀️</Text>
        </View>

        <Text style={styles.title}>{sessionName}</Text>
        <Text style={styles.subtitle}>Meditation Session</Text>

        <View style={styles.progressContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={progress}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            onSlidingComplete={async (value) => {
              if (sound) {
                const newPosition = value * duration;
                await sound.setPositionAsync(newPosition);
                setPosition(newPosition);
              }
            }}
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={{ fontSize: 24 }}>⏮️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.playButton]} 
            onPress={togglePlayPause}
          >
            <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Text style={{ fontSize: 24 }}>⏭️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PlayerScreen;
