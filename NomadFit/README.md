# NomadFit - Comprehensive Fitness Tracking App

A feature-rich React Native app for tracking workouts, exercises, progress, and achieving fitness goals with offline capabilities.

## 🎯 Features

### Core Functionality
- **Workout Management**: Start, track, and end workouts with precise timing
- **Exercise Library**: Comprehensive database of exercises with categories and instructions
- **Progress Tracking**: Monitor fitness progress with charts and statistics
- **Goal Setting**: Set and track fitness goals with progress visualization
- **Achievement System**: Gamified achievements to motivate your fitness journey
- **Workout Templates**: Pre-built and custom workout templates
- **Offline Storage**: Complete offline functionality using MMKV for high performance
- **Material Design 3 UI**: Modern, intuitive interface using React Native Paper

### Advanced Features
- 📊 **Real-time Statistics**: Track total workouts, duration, calories, and streaks
- 🏋️ **Exercise Categories**: Organized by muscle groups and equipment
- 📈 **Progress Charts**: Visual representation of fitness progress over time
- ⏱️ **Workout Timer**: Built-in timer to track workout duration
- 📝 **Exercise Instructions**: Detailed guidance for proper form
- 🎯 **Goal Management**: Set multiple fitness goals with deadlines
- 🏆 **Achievement System**: Unlock achievements as you progress
- 📱 **Responsive Design**: Optimized for all screen sizes

### Data Management
- 💾 **MMKV Storage**: High-performance offline data storage
- 🔄 **Data Synchronization**: Seamless data management across app sessions
- 📊 **Statistics Tracking**: Comprehensive workout statistics and insights
- 🎯 **Personal Records**: Track and celebrate new PRs
- 📤 **Export/Import**: Complete data portability

## 📱 Tech Stack

### Core Technologies
- **React Native** (0.73.4) - Mobile app framework
- **TypeScript** - Type safety and better development experience
- **Expo** (~50.0.0) - Development platform and tooling
- **React Navigation** (6.x) - Screen navigation with stack and tab navigators

### UI/UX
- **React Native Paper** (5.12.3) - Material Design 3 components
- **React Native Chart Kit** (6.12.0) - Progress visualization
- **Expo Vector Icons** - Comprehensive icon library
- **React Native Safe Area Context** - Safe area handling

### Data & Storage
- **React Native MMKV** (2.12.2) - High-performance offline storage
- **React Native Gesture Handler** - Enhanced touch interactions
- **React Native Reanimated** - Smooth animations

## 🚀 Installation

### Prerequisites
- Node.js (14.x or higher)
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Studio (for emulator)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd NomadFit

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── screens/            # Screen components
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

### State Management
- **React Context + useReducer**: Centralized app state
- **MMKV Storage Service**: High-performance data persistence
- **Type-Safe Actions**: TypeScript interfaces for all operations

### Key Services
- **NomadFitService**: MMKV operations and data management
- **NomadFitContext**: Global state management and business logic

## 💪 Usage Guide

### Starting a Workout
1. Tap "Start Workout" on the home screen or FAB
2. Choose workout type (Strength, Cardio, Flexibility, HIIT)
3. Add exercises from the comprehensive library
4. Track sets, reps, weight, and rest time
5. Use the built-in timer to track workout duration
6. End workout to save all data

### Tracking Progress
1. View progress charts in the Progress tab
2. Monitor statistics like total volume and workout frequency
3. Track personal records and achievements
4. Analyze trends over time

### Setting Goals
1. Navigate to Profile tab
2. Add new fitness goals with targets and deadlines
3. Monitor progress with visual indicators
4. Celebrate goal completion

### Exercise Management
1. Browse exercises by category
2. Search exercises by name or muscle group
3. View detailed instructions for proper form
4. Add custom exercises for personalized workouts

## 🎨 In-App Purchases (IAP) Features

### Planned Premium Features
- **AdvancedStats**: Detailed analytics and progress insights
- **CustomRoutines**: Create and save workout templates
- **ExportData**: Export workout data to various formats
- **PremiumThemes**: Additional UI themes and customization
- **CloudSync**: Backup and sync across devices

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm test           # Run test suite
```

### Data Management
The app automatically creates and seeds the database on first launch with:
- 5 default exercises covering major muscle groups
- 2 default workout templates
- 5 default achievements
- Proper indexes for optimal performance

### Adding New Features
1. Update TypeScript types in `src/types/`
2. Extend service layer in `NomadFitService`
3. Add new screens in `src/screens/`
4. Update navigation in `App.tsx`

## 📈 Roadmap

### Phase 1 (Current) ✅
- Core workout tracking functionality
- Exercise library and set logging
- Basic progress visualization
- Offline data storage with MMKV
- Achievement system
- Goal tracking

### Phase 2 (Planned)
- Advanced progress analytics
- Workout templates and routines
- Social features and sharing
- Enhanced data export

### Phase 3 (Future)
- Wearable device integration
- AI-powered workout recommendations
- Community features
- Advanced nutrition tracking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native community for excellent tooling
- React Native Paper for Material Design 3 components
- MMKV for high-performance storage
- React Native Chart Kit for data visualization

---

**NomadFit** - Track your fitness journey with precision and motivation! 💪🏋️‍♂️📈 