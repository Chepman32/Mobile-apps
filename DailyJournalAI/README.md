# Daily Journal AI

A private, AI-powered journal that analyzes sentiment and suggests prompts, storing entries locally on your device.

## Features

### ✨ Core Functionality
- **Private Journaling**: Write daily thoughts and reflections
- **AI Sentiment Analysis**: Real-time mood analysis of your entries
- **Smart Prompts**: AI-generated writing prompts based on your emotional state
- **Local Storage**: All data stays on your device using Realm database
- **Dark/Light Theme**: Customizable appearance
- **Search & Filter**: Find entries by content, date, or mood

### 📊 Insights & Analytics
- **Mood Tracking**: Visual charts of your emotional patterns
- **Writing Streaks**: Track your journaling consistency
- **Tag Analysis**: Discover recurring themes in your writing
- **Sentiment Trends**: See how your mood changes over time

### 🎯 User Experience
- **Haptic Feedback**: Tactile confirmation for interactions
- **Responsive Design**: Beautiful UI that adapts to your preferences
- **Offline First**: No internet required - everything works locally
- **Privacy Focused**: Your data never leaves your device

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development platform and tooling
- **Realm Database**: Local NoSQL database with @realm/react
- **MMKV**: Fast key-value storage for settings
- **React Native Haptic Feedback**: Tactile user feedback

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Setup
1. Clone the repository
```bash
git clone <repository-url>
cd DailyJournalAI
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your preferred platform
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## Project Structure

```
DailyJournalAI/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   │   └── SettingsContext.tsx
│   ├── models/             # Realm database models
│   │   └── JournalEntry.ts
│   ├── navigation/         # Navigation components
│   │   └── MainNavigator.tsx
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── WriteScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── InsightsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # Business logic
│   │   └── SentimentAnalysis.ts
│   └── utils/              # Helper functions
├── App.tsx                 # Main app component
├── package.json
└── README.md
```

## Key Components

### Database Schema (Realm)
```typescript
JournalEntry {
  _id: ObjectId           // Unique identifier
  title: string          // Entry title
  content: string        // Entry content
  date: Date            // Entry date
  mood: string          // Analyzed mood
  sentimentScore: float // Sentiment score (-1 to 1)
  tags: string[]        // Extracted tags
  createdAt: Date       // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Settings (MMKV)
- `isDarkMode`: Theme preference
- `autoAnalyze`: Enable real-time sentiment analysis
- `dailyReminder`: Daily writing reminders
- `reminderTime`: Preferred reminder time
- `enableHapticFeedback`: Tactile feedback setting

## Features in Detail

### 🏠 Home Screen
- Daily writing prompts
- Recent entries preview
- Writing streak tracking
- Quick stats overview

### ✍️ Write Screen
- Rich text input for journal entries
- Real-time sentiment analysis
- AI-generated writing suggestions
- Haptic feedback for interactions

### 📚 History Screen
- Searchable list of all entries
- Filter by mood/sentiment
- Long-press to delete entries
- Tag-based categorization

### 💡 Insights Screen
- Mood distribution charts
- Writing streak statistics
- Sentiment trend analysis
- Most common themes/tags

### ⚙️ Settings Screen
- Theme customization
- Analysis preferences
- Data management (export/clear)
- Privacy information

## Privacy & Security

- **Local-Only Storage**: All data remains on your device
- **No Network Requests**: App works completely offline
- **Encrypted Storage**: Realm provides built-in encryption
- **No Analytics**: No user tracking or data collection

## In-App Purchases (Planned)

- `ai_insights_pro`: Advanced AI analysis features
- `unlimited_entries_pack`: Remove entry limits
- Export to PDF functionality
- Custom writing prompt categories

## Development

### Adding New Features
1. Create components in appropriate folders
2. Update navigation if needed
3. Add any new database models
4. Update TypeScript types
5. Test on both platforms

### Building for Production
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact:
- Email: support@dailyjournalai.com
- Issues: GitHub Issues tab

---

**Daily Journal AI** - Your thoughts, your insights, your privacy.