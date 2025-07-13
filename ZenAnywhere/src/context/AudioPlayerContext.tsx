import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Track } from 'react-native-track-player';
import { useAudioPlayer, UseAudioPlayerProps } from '@hooks/useAudioPlayer';
import { MeditationSession } from '@types/models';

interface AudioPlayerContextType extends ReturnType<typeof useAudioPlayer> {
  // Add any additional context methods or state here
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

interface AudioPlayerProviderProps extends UseAudioPlayerProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({
  children,
  ...props
}) => {
  const audioPlayer = useAudioPlayer({
    ...props,
  });

  // Add any additional context logic here

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
};

// Helper hook for components that only need basic player controls
export const usePlayerControls = () => {
  const {
    play,
    playPlaylist,
    togglePlayPause,
    seekTo,
    skipToNext,
    skipToPrevious,
    setRate,
    setVolume,
  } = useAudioPlayerContext();

  return {
    play,
    playPlaylist,
    togglePlayPause,
    seekTo,
    skipToNext,
    skipToPrevious,
    setRate,
    setVolume,
  };
};

// Helper hook for components that need player state
export const usePlayerState = () => {
  const {
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
    getProgress,
  } = useAudioPlayerContext();

  return {
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
    getProgress,
  };
};

// Helper hook for components that need to know if a specific track is currently playing
export const useIsTrackPlaying = (trackId?: string) => {
  const { currentTrack, isPlaying } = useAudioPlayerContext();
  
  return {
    isCurrentTrack: currentTrack?.id === trackId,
    isPlaying: currentTrack?.id === trackId && isPlaying,
  };
};

// Helper hook for components that need to play a specific track
export const usePlayTrack = () => {
  const { play } = useAudioPlayerContext();
  
  const playTrack = useCallback(async (session: MeditationSession) => {
    return play(session);
  }, [play]);
  
  return playTrack;
};

export default AudioPlayerContext;
