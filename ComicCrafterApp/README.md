# ComicCrafter – Create & Share Your Own Comics

ComicCrafter is an offline-first comic creator. Build comic strips from your photos or bundled templates and share them with friends. All editing happens completely on-device.

## Features
- Create multi-panel comics using photos from your gallery
- Basic image manipulation and cartoon filters powered by Expo Image Manipulator
- Comics and templates stored locally using `AsyncStorage`
- No account required – your creations never leave the device unless you share them
- One‑time in-app purchases to unlock extra template packs or the Pro Upgrade

## Offline Functionality
All comic editing tools, fonts and templates are bundled with the app. Comics are saved to local storage so you can keep working without a network connection. In‑app purchase receipts are cached on device after validation so features remain unlocked while offline.

## Setup
```bash
# install dependencies
yarn install

# run in development
expo start
```

## Testing
A minimal set of unit tests is provided to verify comic saving logic.
```bash
yarn test
```

## Monetization
The app offers optional one‑time purchases:
- **Superhero Pack** – additional templates and stickers
- **Anime Pack** – manga style assets
- **Pro Upgrade** – unlocks all packs and removes export limits

`expo-in-app-purchases` handles purchase flow and stores receipts locally for offline validation.

## Local Storage
Comics are serialized to JSON and saved with `AsyncStorage`. Images are kept in the app’s document directory via `expo-file-system`.
