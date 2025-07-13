# Habit Sculptor

Habit Sculptor is a starting point for an AI-powered habit tracking application built with React Native and Expo. It helps users build positive habits and visualize their progress.

## Features

- 🎯 Track daily, weekly, or custom habits
- 📊 View detailed statistics and progress
- 📈 Track streaks and completion rates
- 🎨 Customizable habits with icons and colors
- 🔔 Set reminders for your habits
- 📱 Offline-first with local data persistence
- 🌙 Dark mode support

## Screens

1. **Today** - View and complete today's habits
2. **Habits** - Manage all your habits in one place
3. **Stats** - Visualize your progress and consistency
4. **Profile** - App settings and user preferences

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Expo CLI
- Android Studio / Xcode (for emulators) or a physical device with Expo Go

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Mobile-apps/HabitSculptorApp
   ```

2. Install dependencies
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server
   ```bash
   expo start
   ```

4. Run on your device/emulator
   - Scan the QR code with Expo Go (iOS) or the Camera app (Android)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Reanimated
- AsyncStorage
- date-fns
- React Native Chart Kit

## Folder Structure

```
src/
  ├── components/     # Reusable UI components
  ├── context/       # React Context providers
  ├── hooks/         # Custom React hooks
  ├── screens/       # App screens
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The current implementation is a starter for tracking habits and journaling. More advanced AI features can be integrated later.
