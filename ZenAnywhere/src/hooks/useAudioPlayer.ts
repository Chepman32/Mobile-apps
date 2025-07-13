import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import TrackPlayer, { State, Event, Track } from 'react-native-track-player';
import { useAuth } from './useAuth';
import { userProgressService } from '@services/meditationService';
import { audioPlayerService } from '@services/audioPlayerService';
import { MeditationSession } from '@types/models';

interface UseAudioPlayerProps {
  onTrackChange?: (track: Track | null) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onPlaybackError?: (error: any) => void;
  autoSaveProgress?: boolean; // Whether to automatically save progress when track changes
}

export const useAudioPlayer = ({
  onTrackChange,
  onPlaybackStateChange,
  onPlaybackError,
  autoSaveProgress = true,
}: UseAudioPlayerProps = {}) => {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const wasPlayingBeforeBackground = useRef(false);
  
  // Initialize the audio player
  useEffect(() => {
    let isMounted = true;
    
    const setupPlayer = async () => {
      try {
        // Setup the audio player
        await audioPlayerService.setupPlayer();
        
        // Restore previous state if available
        const track = await audioPlayerService.getCurrentTrack();
        const state = await audioPlayerService.getPlayerState();
        const queue = await TrackPlayer.getQueue();
        
        if (isMounted) {
          setCurrentTrack(track);
          setIsPlaying(state === State.Playing);
          setQueue(queue as Track[]);
          
          if (track) {
            const index = queue.findIndex(t => t.id === track.id);
            setCurrentTrackIndex(index >= 0 ? index : null);
          }
        }
        
        // Start progress updates
        startProgressUpdates();
        
        // Set up event listeners
        audioPlayerService.setupEventListeners({
          onPlaybackStateChanged: (state) => {
            if (!isMounted) return;
            
            const playing = state === State.Playing;
            const buffering = state === State.Buffering || state === State.Connecting;
            
            setIsPlaying(playing);
            setIsBuffering(buffering);
            onPlaybackStateChange?.(playing);
          },
          onPlaybackError: (error) => {
            console.error('Playback error:', error);
            onPlaybackError?.(error);
          },
          onTrackChanged: async (trackId) => {
            if (!isMounted || trackId === null) return;
            
            const track = await TrackPlayer.getTrack(trackId);
            const queue = await TrackPlayer.getQueue();
            const index = queue.findIndex(t => t.id === trackId);
            
            if (track) {
              setCurrentTrack(track);
              setCurrentTrackIndex(index >= 0 ? index : null);
              setQueue(queue as Track[]);
              onTrackChange?.(track);
              
              // Save progress for the previous track if auto-save is enabled
              if (autoSaveProgress && currentTrack && user) {
                saveProgress(currentTrack.id as string, position);
              }
            }
          },
          onPlaybackQueueEnded: () => {
            if (autoSaveProgress && currentTrack && user) {
              saveProgress(currentTrack.id as string, duration);
            }
          },
        });
        
        // Set up app state listener
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        return () => {
          subscription.remove();
          audioPlayerService.removeEventListeners();
          stopProgressUpdates();
        };
      } catch (error) {
        console.error('Error initializing audio player:', error);
      }
    };
    
    setupPlayer();
    
    return () => {
      isMounted = false;
      audioPlayerService.removeEventListeners();
      stopProgressUpdates();
    };
  }, [user?.id]);
  
  // Handle app state changes (background/foreground)
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground
      if (wasPlayingBeforeBackground.current) {
        await audioPlayerService.play();
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App has gone to the background
      const state = await audioPlayerService.getPlayerState();
      wasPlayingBeforeBackground.current = state === State.Playing;
      
      // Pause playback when app goes to background
      if (wasPlayingBeforeBackground.current) {
        await audioPlayerService.pause();
      }
    }
    
    appState.current = nextAppState;
  }, []);
  
  // Start progress updates
  const startProgressUpdates = useCallback(() => {
    stopProgressUpdates();
    
    progressInterval.current = setInterval(async () => {
      try {
        const progress = await audioPlayerService.getProgress();
        setPosition(progress.position);
        setDuration(progress.duration);
        setBuffered(progress.buffered);
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }, 1000);
  }, []);
  
  // Stop progress updates
  const stopProgressUpdates = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);
  
  // Save progress for the current track
  const saveProgress = useCallback(async (sessionId: string, position: number) => {
    if (!user) return;
    
    try {
      // Only save if the user has listened to at least 10 seconds
      if (position > 10) {
        await userProgressService.updateInProgressSession(user.id, sessionId, position);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [user?.id]);
  
  // Play a meditation session
  const play = useCallback(async (session: MeditationSession) => {
    try {
      await audioPlayerService.playMeditation(session);
      return true;
    } catch (error) {
      console.error('Error playing session:', error);
      onPlaybackError?.(error);
      return false;
    }
  }, [onPlaybackError]);
  
  // Play a playlist
  const playPlaylist = useCallback(async (sessions: MeditationSession[], startIndex: number = 0) => {
    try {
      await audioPlayerService.playPlaylist(sessions, startIndex);
      return true;
    } catch (error) {
      console.error('Error playing playlist:', error);
      onPlaybackError?.(error);
      return false;
    }
  }, [onPlaybackError]);
  
  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    try {
      await audioPlayerService.togglePlayback();
    } catch (error) {
      console.error('Error toggling playback:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Seek to a position in the current track
  const seekTo = useCallback(async (position: number) => {
    try {
      await audioPlayerService.seekTo(position);
      setPosition(position);
    } catch (error) {
      console.error('Error seeking:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Skip to next track
  const skipToNext = useCallback(async () => {
    try {
      await audioPlayerService.skipToNext();
    } catch (error) {
      console.error('Error skipping to next track:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Skip to previous track
  const skipToPrevious = useCallback(async () => {
    try {
      await audioPlayerService.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Set playback rate
  const setRate = useCallback(async (rate: number) => {
    try {
      await audioPlayerService.setPlaybackSpeed(rate);
      setPlaybackRate(rate);
    } catch (error) {
      console.error('Error setting playback rate:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Set volume
  const setPlayerVolume = useCallback(async (newVolume: number) => {
    try {
      await audioPlayerService.setVolume(newVolume);
      setVolume(newVolume);
    } catch (error) {
      console.error('Error setting volume:', error);
      onPlaybackError?.(error);
    }
  }, [onPlaybackError]);
  
  // Get current track progress
  const getProgress = useCallback(() => {
    return {
      position,
      duration,
      buffered,
      progress: duration > 0 ? position / duration : 0,
    };
  }, [position, duration, buffered]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopProgressUpdates();
    };
  }, [stopProgressUpdates]);
  
  return {
    // State
    currentTrack,
    isPlaying,
    isBuffering,
    duration,
    position,
    buffered,
    playbackRate,
    volume,
    queue,
    currentTrackIndex,
    
    // Actions
    play,
    playPlaylist,
    togglePlayPause,
    seekTo,
    skipToNext,
    skipToPrevious,
    setRate,
    setVolume: setPlayerVolume,
    getProgress,
  };
};
