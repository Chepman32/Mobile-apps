declare module 'react-native-track-player' {
  import { EventEmitter } from 'events';
  import { ComponentType } from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  // Types for Track
  export interface Track {
    id: string;
    url: string | number;
    type?: string;
    contentType?: string;
    duration?: number;
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    date?: string;
    description?: string;
    rating?: number | boolean;
    artwork?: string | number | { [key: string]: any };
    [key: string]: any;
  }

  // Types for State
  export type State = {
    NONE: 'none';
    READY: 'ready';
    PLAYING: 'playing';
    PAUSED: 'paused';
    STOPPED: 'stopped';
    BUFFERING: 'buffering';
    CONNECTING: 'connecting';
  };

  export const STATE_NONE: State['NONE'];
  export const STATE_READY: State['READY'];
  export const STATE_PLAYING: State['PLAYING'];
  export const STATE_PAUSED: State['PAUSED'];
  export const STATE_STOPPED: State['STOPPED'];
  export const STATE_BUFFERING: State['BUFFERING'];
  export const STATE_CONNECTING: State['CONNECTING'];

  // Types for Capability
  export type Capability = {
    PLAY: 'play';
    PLAY_FROM_ID: 'playFromId';
    PLAY_FROM_SEARCH: 'playFromSearch';
    PAUSE: 'pause';
    STOP: 'stop';
    SEEK_TO: 'seekTo';
    SKIP: 'skip';
    SKIP_TO_NEXT: 'skipToNext';
    SKIP_TO_PREVIOUS: 'skipToPrevious';
    JUMP_FORWARD: 'jumpForward';
    JUMP_BACKWARD: 'jumpBackward';
    SET_RATING: 'setRating';
    LIKE: 'like';
    DISLIKE: 'dislike';
    BOOKMARK: 'bookmark';
  };

  export const CAPABILITY_PLAY: Capability['PLAY'];
  export const CAPABILITY_PLAY_FROM_ID: Capability['PLAY_FROM_ID'];
  export const CAPABILITY_PLAY_FROM_SEARCH: Capability['PLAY_FROM_SEARCH'];
  export const CAPABILITY_PAUSE: Capability['PAUSE'];
  export const CAPABILITY_STOP: Capability['STOP'];
  export const CAPABILITY_SEEK_TO: Capability['SEEK_TO'];
  export const CAPABILITY_SKIP: Capability['SKIP'];
  export const CAPABILITY_SKIP_TO_NEXT: Capability['SKIP_TO_NEXT'];
  export const CAPABILITY_SKIP_TO_PREVIOUS: Capability['SKIP_TO_PREVIOUS'];
  export const CAPABILITY_JUMP_FORWARD: Capability['JUMP_FORWARD'];
  export const CAPABILITY_JUMP_BACKWARD: Capability['JUMP_BACKWARD'];
  export const CAPABILITY_SET_RATING: Capability['SET_RATING'];
  export const CAPABILITY_LIKE: Capability['LIKE'];
  export const CAPABILITY_DISLIKE: Capability['DISLIKE'];
  export const CAPABILITY_BOOKMARK: Capability['BOOKMARK'];

  // Types for Event
  export type Event =
    | 'playback-state'
    | 'playback-error'
    | 'playback-queue-ended'
    | 'playback-track-changed'
    | 'playback-metadata-received'
    | 'remote-play'
    | 'remote-pause'
    | 'remote-stop'
    | 'remote-next'
    | 'remote-previous'
    | 'remote-jump-forward'
    | 'remote-jump-backward'
    | 'remote-seek'
    | 'remote-set-rating'
    | 'remote-duck'
    | 'remote-like'
    | 'remote-dislike'
    | 'remote-bookmark';

  // Types for TrackMetadataBase
  export interface TrackMetadataBase {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: string | number | { [key: string]: any };
    duration?: number;
  }

  // Types for NowPlayingMetadata
  export interface NowPlayingMetadata extends TrackMetadataBase {
    elapsedTime?: number;
    [key: string]: any;
  }

  // Types for PlaybackState
  export interface PlaybackState {
    state: State[keyof State];
    duration: number;
    position: number;
    bufferedPosition: number;
    playWhenReady?: boolean;
    lastPositionUpdateReceivedAt?: number;
    lastUpdated?: number;
    playbackType?: string;
    error?: string;
  }

  // Types for TrackPlayerOptions
  export interface TrackPlayerOptions {
    minBuffer?: number;
    maxBuffer?: number;
    playBuffer?: number;
    backBuffer?: number;
    maxCacheSize?: number;
    iosCategory?: string;
    iosCategoryMode?: string;
    iosCategoryOptions?: string[];
    iosCategoryMixWithOthers?: boolean;
    iosPlayInBackgroundNotification?: boolean;
    waitForBuffer?: boolean;
    autoUpdateMetadata?: boolean;
    autoHandleInterruptions?: boolean;
    autoHandleSetRating?: boolean;
    capabilities?: Array<keyof Capability>;
    notificationCapabilities?: Array<keyof Capability>;
    compactCapabilities?: Array<keyof Capability>;
    icon?: number;
    playIcon?: number;
    pauseIcon?: number;
    stopIcon?: number;
    previousIcon?: number;
    nextIcon?: number;
    rewindIcon?: number;
    forwardIcon?: number;
    color?: number;
    stopWithApp?: boolean;
  }

  // Types for Progress
  export interface Progress {
    position: number;
    duration: number;
    buffered: number;
    playableDuration: number;
    seekableDuration: number;
  }

  // Main module exports
  export const TrackPlayer: {
    // Player methods
    setupPlayer(options?: TrackPlayerOptions): Promise<void>;
    destroy(): Promise<void>;
    updateOptions(options: TrackPlayerOptions): Promise<void>;
    updateMetadataForTrack(trackId: string, metadata: TrackMetadataBase): Promise<void>;
    
    // Queue management
    add(tracks: Track | Track[], insertBeforeId?: string): Promise<void>;
    remove(trackIds: string | string[]): Promise<void>;
    skip(trackId: string): Promise<void>;
    skipToNext(): Promise<void>;
    skipToPrevious(): Promise<void>;
    removeUpcomingTracks(): Promise<void>;
    
    // Playback control
    reset(): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    stop(): Promise<void>;
    seekTo(position: number): Promise<void>;
    setVolume(level: number): Promise<void>;
    setRate(rate: number): Promise<void>;
    setRepeatMode(mode: number): Promise<void>;
    
    // Getters
    getQueue(): Promise<Track[]>;
    getTrack(id: string): Promise<Track | null>;
    getCurrentTrack(): Promise<string | null>;
    getVolume(): Promise<number>;
    getDuration(): Promise<number>;
    getPosition(): Promise<number>;
    getBufferedPosition(): Promise<number>;
    getState(): Promise<State[keyof State]>;
    getRate(): Promise<number>;
    
    // Event listeners
    addEventListener(event: Event, listener: (data: any) => void): void;
    removeEventListener(event: Event, listener: (data: any) => void): void;
    
    // Constants
    STATE_NONE: State['NONE'];
    STATE_READY: State['READY'];
    STATE_PLAYING: State['PLAYING'];
    STATE_PAUSED: State['PAUSED'];
    STATE_STOPPED: State['STOPPED'];
    STATE_BUFFERING: State['BUFFERING'];
    STATE_CONNECTING: State['CONNECTING'];
    
    CAPABILITY_PLAY: Capability['PLAY'];
    CAPABILITY_PLAY_FROM_ID: Capability['PLAY_FROM_ID'];
    CAPABILITY_PLAY_FROM_SEARCH: Capability['PLAY_FROM_SEARCH'];
    CAPABILITY_PAUSE: Capability['PAUSE'];
    CAPABILITY_STOP: Capability['STOP'];
    CAPABILITY_SEEK_TO: Capability['SEEK_TO'];
    CAPABILITY_SKIP: Capability['SKIP'];
    CAPABILITY_SKIP_TO_NEXT: Capability['SKIP_TO_NEXT'];
    CAPABILITY_SKIP_TO_PREVIOUS: Capability['SKIP_TO_PREVIOUS'];
    CAPABILITY_JUMP_FORWARD: Capability['JUMP_FORWARD'];
    CAPABILITY_JUMP_BACKWARD: Capability['JUMP_BACKWARD'];
    CAPABILITY_SET_RATING: Capability['SET_RATING'];
    CAPABILITY_LIKE: Capability['LIKE'];
    CAPABILITY_DISLIKE: Capability['DISLIKE'];
    CAPABILITY_BOOKMARK: Capability['BOOKMARK'];
  };

  // Hooks
  export function useTrackPlayerEvents(events: Event[], handler: (data: any) => void): void;
  
  export function usePlaybackState(): State[keyof State];
  
  export function useTrackPlayerProgress(
    interval?: number
  ): {
    position: number;
    duration: number;
    buffered: number;
  };

  // Components
  export interface ProgressBarProps {
    style?: StyleProp<ViewStyle>;
    theme?: {
      minimumTrackTintColor?: string;
      maximumTrackTintColor?: string;
      thumbTintColor?: string;
    };
  }

  export const ProgressBar: ComponentType<ProgressBarProps>;

  // Default export
  const trackPlayer: typeof TrackPlayer;
  export default trackPlayer;
}
