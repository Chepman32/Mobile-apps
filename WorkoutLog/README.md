# WorkoutLog - Comprehensive Gym Workout Tracker

A feature-rich React Native app for tracking gym workouts, sets, reps, and progress with offline capabilities.

## 🎯 Features

### Core Functionality
- **Workout Management**: Start, track, and end workouts with precise timing
- **Exercise Library**: Comprehensive database of exercises with categories and instructions
- **Set Tracking**: Log sets with reps, weight, rest time, and duration
- **Progress Visualization**: Charts and statistics showing your fitness journey
- **Offline Storage**: Complete offline functionality using SQLite database
- **Material Design UI**: Modern, intuitive interface using React Native Paper

### Exercise Tracking
- 📊 **Real-time Set Logging**: Add sets during workouts with weight, reps, and rest time
- 🏋️ **Exercise Categories**: Organized by muscle groups (Chest, Back, Shoulders, Arms, Legs, Core, Cardio)
- 📈 **Progress Charts**: Visual representation of strength and volume progress
- ⏱️ **Workout Timer**: Built-in timer to track workout duration
- 📝 **Exercise Instructions**: Detailed guidance for proper form

### Data Management
- 💾 **SQLite Database**: Robust offline data storage
- 🔄 **Data Synchronization**: Seamless data management across app sessions
- 📊 **Statistics Tracking**: Comprehensive workout statistics and achievements
- 🎯 **Personal Records**: Track and celebrate new PRs

## 📱 Tech Stack

### Core Technologies
- **React Native** (0.79.5) - Mobile app framework
- **TypeScript** - Type safety and better development experience
- **Expo** (~52.0.23) - Development platform and tooling
- **React Navigation** (7.x) - Screen navigation with stack and tab navigators

### UI/UX
- **React Native Paper** (5.12.3) - Material Design components
- **React Native Chart Kit** (6.12.0) - Progress visualization
- **Expo Vector Icons** - Comprehensive icon library
- **React Native Safe Area Context** - Safe area handling

### Data & Storage
- **Expo SQLite** (15.1.0) - Offline database storage
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
cd WorkoutLog

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 📊 Database Schema

### Core Tables
- **exercises**: Exercise library with categories and instructions
- **workouts**: Workout sessions with timing and metadata
- **exercise_logs**: Exercises performed in specific workouts
- **exercise_sets**: Individual sets with reps, weight, and timing
- **user_profiles**: User information and preferences
- **progress_entries**: Historical progress data for analytics

### Key Relationships
```
workouts (1) → (many) exercise_logs
exercise_logs (1) → (many) exercise_sets
exercises (1) → (many) exercise_logs
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
- **Local Database Service**: SQLite operations and data persistence
- **Type-Safe Actions**: TypeScript interfaces for all operations

### Key Services
- **DatabaseService**: SQLite operations and schema management
- **AppContext**: Global state management and business logic

## 💪 Usage Guide

### Starting a Workout
1. Tap "Start Workout" on the main screen
2. Add exercises from the comprehensive library
3. Log sets with weight, reps, and rest time
4. Use the built-in timer to track workout duration
5. End workout to save all data

### Tracking Progress
1. View progress charts in the Progress tab
2. Monitor statistics like total volume and workout frequency
3. Track personal records and achievements
4. Analyze trends over time

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

### Database Development
The app automatically creates and seeds the database on first launch with:
- 10 default exercises covering major muscle groups
- Default user profile with beginner settings
- Proper indexes for optimal performance

### Adding New Features
1. Update TypeScript types in `src/types/`
2. Extend database schema in `DatabaseService`
3. Add new screens in `src/screens/`
4. Update navigation in `App.tsx`

## 📈 Roadmap

### Phase 1 (Current) ✅
- Core workout tracking functionality
- Exercise library and set logging
- Basic progress visualization
- Offline data storage

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
- Expo team for simplifying mobile development
- Material Design for UI/UX guidelines
- Fitness community for feature inspiration

---

**WorkoutLog** - Track your fitness journey with precision and motivation! 💪🏋️‍♂️📈