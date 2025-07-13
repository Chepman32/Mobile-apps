import { Track } from 'react-native-track-player';

export interface AudioTrack extends Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
  description?: string;
  genre?: string;
  date?: string;
  sessionId: string;
  category: string;
  isPremium: boolean;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isBuffering: boolean;
  duration: number;
  position: number;
  buffered: number;
  playbackRate: number;
  volume: number;
  queue: AudioTrack[];
  currentTrackIndex: number | null;
}

export interface AudioPlayerControls {
  play: (track: AudioTrack) => Promise<boolean>;
  playPlaylist: (tracks: AudioTrack[], startIndex?: number) => Promise<boolean>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => void;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getProgress: () => {
    position: number;
    duration: number;
    buffered: number;
    progress: number;
  };
}

export interface AudioPlayerContextType extends AudioPlayerState, AudioPlayerControls {}

export interface UseAudioPlayerProps {
  onTrackChange?: (track: AudioTrack | null) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
  onPlaybackError?: (error: any) => void;
  autoSaveProgress?: boolean;
}

export interface PlaybackProgress {
  position: number;
  duration: number;
  buffered: number;
  progress: number;
}
