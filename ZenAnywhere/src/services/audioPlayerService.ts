import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { Platform } from 'react-native';
import { MeditationSession } from '@types/models';
import { audioService } from './audioService';

// Configure the audio player
export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 10, // 10 MB
    });
    
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SeekTo,
      ],
      progressUpdateEventInterval: 1, // seconds
    });
    
    // Set volume and repeat mode
    await TrackPlayer.setVolume(1.0);
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    
    return true;
  } catch (error) {
    console.error('Error setting up audio player:', error);
    return false;
  }
};

// Play a meditation session
export const playMeditation = async (session: MeditationSession, position: number = 0) => {
  try {
    // Stop any currently playing track
    await TrackPlayer.reset();
    
    // Create track object
    const track: Track = {
      id: session.id,
      url: session.audio.url,
      title: session.title,
      artist: session.instructor,
      artwork: session.imageUrl,
      duration: session.duration,
      description: session.description,
      genre: session.category,
      date: session.createdAt?.toDate().toISOString(),
      // Additional metadata
      sessionId: session.id,
      category: session.category,
      isPremium: session.isPremium,
    };
    
    // Add track to queue
    await TrackPlayer.add([track]);
    
    // Start playback
    await TrackPlayer.play();
    
    // Seek to position if provided
    if (position > 0) {
      await TrackPlayer.seekTo(position);
    }
    
    // Update play count in the background
    audioService.incrementPlayCount(session.id);
    
    return true;
  } catch (error) {
    console.error('Error playing meditation:', error);
    return false;
  }
};

// Play a playlist of sessions
export const playPlaylist = async (sessions: MeditationSession[], startIndex: number = 0) => {
  try {
    if (sessions.length === 0) return false;
    
    // Stop any currently playing track
    await TrackPlayer.reset();
    
    // Create track objects
    const tracks = sessions.map(session => ({
      id: session.id,
      url: session.audio.url,
      title: session.title,
      artist: session.instructor,
      artwork: session.imageUrl,
      duration: session.duration,
      description: session.description,
      genre: session.category,
      date: session.createdAt?.toDate().toISOString(),
      // Additional metadata
      sessionId: session.id,
      category: session.category,
      isPremium: session.isPremium,
    }));
    
    // Add tracks to queue
    await TrackPlayer.add(tracks);
    
    // Start playback from the specified index
    await TrackPlayer.skip(startIndex);
    await TrackPlayer.play();
    
    // Update play count for the first track
    if (sessions[startIndex]) {
      audioService.incrementPlayCount(sessions[startIndex].id);
    }
    
    return true;
  } catch (error) {
    console.error('Error playing playlist:', error);
    return false;
  }
};

// Toggle play/pause
export const togglePlayback = async () => {
  const state = await TrackPlayer.getState();
  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else if (state === State.Paused || state === State.Ready) {
    await TrackPlayer.play();
  }
};

// Seek to a specific position in the current track
export const seekTo = async (position: number) => {
  await TrackPlayer.seekTo(position);
};

// Skip to next track
export const skipToNext = async () => {
  try {
    await TrackPlayer.skipToNext();
    
    // Get current track and update play count
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack) {
      const track = await TrackPlayer.getTrack(currentTrack);
      if (track?.sessionId) {
        audioService.incrementPlayCount(track.sessionId);
      }
    }
  } catch (error) {
    console.error('Error skipping to next track:', error);
  }
};

// Skip to previous track
export const skipToPrevious = async () => {
  try {
    const position = await TrackPlayer.getPosition();
    
    // If we're more than 3 seconds into the track, go to the beginning
    if (position > 3) {
      await TrackPlayer.seekTo(0);
    } else {
      await TrackPlayer.skipToPrevious();
      
      // Get current track and update play count
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack) {
        const track = await TrackPlayer.getTrack(currentTrack);
        if (track?.sessionId) {
          audioService.incrementPlayCount(track.sessionId);
        }
      }
    }
  } catch (error) {
    console.error('Error skipping to previous track:', error);
  }
};

// Set playback speed
export const setPlaybackSpeed = async (rate: number) => {
  await TrackPlayer.setRate(rate);
};

// Set volume (0.0 to 1.0)
export const setVolume = async (volume: number) => {
  await TrackPlayer.setVolume(Math.max(0, Math.min(1, volume)));
};

// Get current track
export const getCurrentTrack = async () => {
  const trackId = await TrackPlayer.getCurrentTrack();
  if (trackId === null) return null;
  
  return await TrackPlayer.getTrack(trackId);
};

// Get player state
export const getPlayerState = async () => {
  return await TrackPlayer.getState();
};

// Get current position and duration
export const getProgress = async () => {
  const position = await TrackPlayer.getPosition();
  const duration = await TrackPlayer.getDuration();
  const buffered = await TrackPlayer.getBufferedPosition();
  
  return {
    position,
    duration,
    buffered,
    progress: duration > 0 ? position / duration : 0,
  };
};

// Check if a track is currently playing
export const isPlaying = async () => {
  const state = await TrackPlayer.getState();
  return state === State.Playing;
};

// Set up event listeners
export const setupEventListeners = (callbacks: {
  onPlaybackStateChanged?: (state: State) => void;
  onPlaybackError?: (error: any) => void;
  onTrackChanged?: (trackId: string | null) => void;
  onPlaybackQueueEnded?: () => void;
}) => {
  const { onPlaybackStateChanged, onPlaybackError, onTrackChanged, onPlaybackQueueEnded } = callbacks;
  
  // Playback state changed
  if (onPlaybackStateChanged) {
    TrackPlayer.addEventListener(Event.PlaybackState, (event: any) => {
      onPlaybackStateChanged(event.state);
    });
  }
  
  // Playback error
  if (onPlaybackError) {
    TrackPlayer.addEventListener(Event.PlaybackError, (error: any) => {
      console.error('Playback error:', error);
      onPlaybackError(error);
    });
  }
  
  // Track changed
  if (onTrackChanged) {
    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event: any) => {
      if (event.nextTrack !== undefined && event.nextTrack !== null) {
        onTrackChanged(event.nextTrack);
      } else {
        onTrackChanged(null);
      }
    });
  }
  
  // Playback queue ended
  if (onPlaybackQueueEnded) {
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
      onPlaybackQueueEnded();
    });
  }
};

// Clean up event listeners
export const removeEventListeners = () => {
  TrackPlayer.removeEventListener(Event.PlaybackState);
  TrackPlayer.removeEventListener(Event.PlaybackError);
  TrackPlayer.removeEventListener(Event.PlaybackTrackChanged);
  TrackPlayer.removeEventListener(Event.PlaybackQueueEnded);
};

// Custom hook for player state
export const usePlayerState = () => {
  const state = usePlaybackState();
  const progress = useProgress();
  
  return {
    isPlaying: state === State.Playing,
    isPaused: state === State.Paused,
    isStopped: state === State.Stopped,
    isBuffering: state === State.Buffering,
    isConnecting: state === State.Connecting,
    isReady: state === State.Ready,
    isEnded: state === State.Ended,
    progress,
    position: progress.position,
    duration: progress.duration,
    buffered: progress.buffered,
  };
};

// Custom hook for track changes
export const useTrackChanges = (onTrackChanged: (track: Track | null) => void) => {
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event: any) => {
    if (event.nextTrack !== undefined && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      onTrackChanged(track);
    } else {
      onTrackChanged(null);
    }
  });
};

// Custom hook for playback state changes
export const usePlaybackStateChange = (onStateChanged: (state: State) => void) => {
  useTrackPlayerEvents([Event.PlaybackState], (event: any) => {
    onStateChanged(event.state);
  });
};

// Clean up the player
export const cleanupPlayer = async () => {
  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    removeEventListeners();
  } catch (error) {
    console.error('Error cleaning up player:', error);
  }
};
