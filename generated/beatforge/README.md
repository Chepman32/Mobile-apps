# BeatForge

Fingertap drum studio generating shareable beat GIFs with mic auto-detect tempo.

## Features

- 16-pad drum grid with professional samples
- Real-time sequencer with tempo detection
- Mix and export beats as shareable GIFs
- Microphone tempo detection
- SQLite beat storage
- In-app purchases for drum kits and stem exports

## Tech Stack

- Expo + TypeScript
- expo-av for audio playback and recording
- react-native-gesture-handler for pad interactions
- react-native-sqlite-storage for beat storage
- DSP.js for audio processing
- react-native-iap for purchases

## Installation

```bash
# Install dependencies
yarn

# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## IAP Products

- `kit_pack`: Premium drum kit collections
- `export_stems`: Export individual track stems