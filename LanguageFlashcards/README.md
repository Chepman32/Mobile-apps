# LanguageFlashcards

A comprehensive language learning app with spaced repetition flashcards, offline-first architecture, and advanced study features.

## 🌟 Features

### Core Learning Features
- **Spaced Repetition System**: Advanced algorithm for optimal learning intervals
- **Multi-Language Support**: Support for Spanish, French, German, and more
- **Custom Decks**: Create and organize flashcards by language and category
- **Audio Pronunciation**: Text-to-speech for proper pronunciation
- **Progress Tracking**: Detailed analytics and learning statistics

### Study Features
- **Smart Review Scheduling**: Cards are scheduled based on performance
- **Due Cards Management**: Focus on cards that need review
- **Study Sessions**: Track study time and performance
- **Achievement System**: Gamification to motivate learning
- **Streak Tracking**: Maintain daily study habits

### User Experience
- **Offline-First**: Works completely offline with local storage
- **Material Design 3**: Modern, accessible UI components
- **Dark/Light Theme**: Customizable appearance
- **Export/Import**: Backup and restore your data
- **Search & Filter**: Find cards and decks quickly

### Advanced Features
- **Flashcard Management**: Create, edit, and organize cards
- **Deck Organization**: Categorize by language, difficulty, and topic
- **Study Analytics**: Detailed progress charts and insights
- **Performance Metrics**: Accuracy, speed, and retention tracking
- **Study History**: Complete record of learning sessions

## 🛠️ Tech Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens

### State Management & Storage
- **React Context + useReducer**: Global state management
- **MMKV**: High-performance key-value storage
- **React Native Paper**: Material Design 3 components

### UI & UX
- **Material Design 3**: Modern design system
- **React Native Vector Icons**: Icon library
- **React Native Chart Kit**: Data visualization

### Language Learning Features
- **Spaced Repetition Algorithm**: SM-2 algorithm implementation
- **Expo Speech**: Text-to-speech functionality
- **Custom Audio Support**: Pronunciation audio files

## 📱 Screens & Navigation

### Tab Navigation
- **Home**: Dashboard with quick actions and statistics
- **Decks**: Manage and browse flashcard decks
- **Study**: Study session management and due cards
- **Progress**: Learning analytics and charts
- **Profile**: User settings and account management

### Stack Navigation
- **Deck Details**: View and manage individual decks
- **Add/Edit Deck**: Create and modify decks
- **Add/Edit Flashcard**: Create and modify cards
- **Study Session**: Active study interface
- **Flashcard Review**: Individual card review
- **Settings**: App configuration
- **Achievements**: User achievements and badges
- **Study History**: Session history and analytics

## 🏗️ Architecture

### Project Structure
```
LanguageFlashcards/
├── App.tsx                    # Main app component
├── package.json               # Dependencies and scripts
├── README.md                  # Project documentation
├── src/
│   ├── components/            # Reusable UI components
│   ├── context/              # React Context providers
│   │   └── LanguageFlashcardsContext.tsx
│   ├── services/             # Business logic layer
│   │   └── LanguageFlashcardsService.ts
│   ├── screens/              # Navigation screens
│   │   ├── HomeScreen.tsx
│   │   ├── DecksScreen.tsx
│   │   ├── StudyScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── [Other screens...]
│   └── types/                # TypeScript definitions
│       └── index.ts
```

### Data Models
- **User**: Profile, preferences, and statistics
- **Deck**: Flashcard collections with metadata
- **Flashcard**: Individual cards with spaced repetition data
- **Review**: Study session records
- **StudySession**: Learning session tracking
- **Progress**: Learning analytics data
- **Achievement**: Gamification achievements

### State Management
- **LanguageFlashcardsContext**: Global state with useReducer
- **Service Layer**: Business logic and data persistence
- **MMKV Storage**: High-performance offline storage

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LanguageFlashcards
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

### Environment Setup

1. **iOS Development**
   ```bash
   npx expo run:ios
   ```

2. **Android Development**
   ```bash
   npx expo run:android
   ```

## 📖 Usage Guide

### Getting Started

1. **Create Your First Deck**
   - Tap the "+" button on the Decks screen
   - Enter deck name, language, and description
   - Choose difficulty level and category

2. **Add Flashcards**
   - Open a deck and tap "Add Cards"
   - Enter front (question) and back (answer)
   - Add pronunciation and notes
   - Save the card

3. **Start Studying**
   - Go to the Study screen
   - Tap "Start Studying" for due cards
   - Or select a specific deck to study

4. **Review Cards**
   - Swipe through flashcards
   - Rate your performance (1-5 stars)
   - Cards are rescheduled based on your rating

### Study Features

- **Spaced Repetition**: Cards appear at optimal intervals
- **Due Cards**: Focus on cards that need review
- **Study Sessions**: Track your learning progress
- **Progress Analytics**: View detailed statistics
- **Achievements**: Unlock badges for milestones

### Data Management

- **Export Data**: Backup your flashcards and progress
- **Import Data**: Restore from backup
- **Offline Storage**: All data stored locally
- **Sync**: Manual sync between devices

## 🎯 Key Features Explained

### Spaced Repetition Algorithm
The app uses the SM-2 algorithm for optimal learning:
- **New Cards**: Start with 1-day interval
- **Learning Cards**: Gradual interval increase
- **Review Cards**: Based on performance and ease factor
- **Lapse Cards**: Reset to 1-day interval

### Study Session Types
- **Review**: Due cards that need review
- **New**: Cards being learned for the first time
- **Mixed**: Combination of new and review cards

### Progress Tracking
- **Daily Streaks**: Maintain study consistency
- **Accuracy Metrics**: Track learning effectiveness
- **Study Time**: Monitor learning duration
- **Card Mastery**: Track individual card progress

## 🔧 Development

### Code Style
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **React Native Paper**: Consistent UI components

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Building for Production

1. **iOS Build**
   ```bash
   npx expo build:ios
   ```

2. **Android Build**
   ```bash
   npx expo build:android
   ```

3. **EAS Build (Recommended)**
   ```bash
   npx eas build --platform ios
   npx eas build --platform android
   ```

## 📊 Performance

### Optimizations
- **MMKV Storage**: High-performance data persistence
- **Lazy Loading**: Load data on demand
- **Memoization**: Optimize re-renders
- **Offline-First**: No network dependency

### Memory Management
- **Efficient State Updates**: Minimal re-renders
- **Image Optimization**: Compressed assets
- **Background Processing**: Non-blocking operations

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Guidelines
- Follow TypeScript best practices
- Use Material Design 3 components
- Write meaningful commit messages
- Add documentation for new features

### Testing Guidelines
- Unit tests for business logic
- Integration tests for API calls
- UI tests for critical user flows
- Performance testing for data operations

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Spaced repetition algorithm
- [x] Multi-language support
- [x] Offline storage
- [x] Basic UI/UX

### Phase 2: Advanced Features 🔄
- [ ] Audio pronunciation
- [ ] Advanced analytics
- [ ] Achievement system
- [ ] Study reminders

### Phase 3: Enhanced Experience 📋
- [ ] Cloud sync
- [ ] Social features
- [ ] Advanced customization
- [ ] Performance optimizations

### Phase 4: Premium Features 📋
- [ ] Advanced statistics
- [ ] Custom themes
- [ ] Export to other formats
- [ ] Integration with learning platforms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anki**: Inspiration for spaced repetition algorithm
- **React Native Paper**: Material Design 3 components
- **Expo**: Development platform and tools
- **MMKV**: High-performance storage solution

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

---

**LanguageFlashcards** - Master languages with spaced repetition and smart learning algorithms. 