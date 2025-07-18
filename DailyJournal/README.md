# Daily Journal - Capture Thoughts and Memories Securely

A comprehensive offline journaling app built with React Native and Expo, featuring rich text editing, encryption, and advanced organization features.

## Features

### Core Functionality
- ✅ **Rich Text Editor**: Full-featured editor with formatting options
- ✅ **Offline Storage**: SQLite database for reliable offline access
- ✅ **Search & Filter**: Search by content and filter by tags
- ✅ **Tag System**: Organize entries with custom tags
- ✅ **Encryption**: Secure entries with password-based encryption

### Advanced Features
- ✅ **Mood Tracking**: Record your emotional state with each entry
- ✅ **Weather Log**: Track weather conditions
- ✅ **Location Notes**: Add location context to entries
- ✅ **Statistics**: View journaling habits and insights
- ✅ **Export/Import**: Backup and restore your data

### Security Features
- ✅ **End-to-End Encryption**: Secure your personal thoughts
- ✅ **Biometric Support**: Quick access with fingerprint/face unlock
- ✅ **Auto-Lock**: Automatic session timeout for security
- ✅ **Secure Storage**: Encrypted local storage

## Technologies Used

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Native Paper**: Material Design components

### Data & Storage
- **SQLite**: Local database for offline storage
- **AsyncStorage**: Settings and preferences
- **Expo SecureStore**: Encrypted credential storage
- **Expo Crypto**: Cryptographic operations

### Rich Text & UI
- **react-native-pell-rich-editor**: Rich text editing
- **react-native-tag-input**: Tag management
- **react-native-modal**: Modal dialogs
- **react-native-vector-icons**: Icons

## Installation

1. **Prerequisites**
   ```bash
   npm install -g expo-cli
   ```

2. **Install Dependencies**
   ```bash
   cd DailyJournal
   npm install
   ```

3. **Run the App**
   ```bash
   npm start
   ```

## Project Structure

```
DailyJournal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EntryEditor.tsx  # Rich text entry editor
│   │   ├── EntryViewer.tsx  # Entry display component
│   │   └── SettingsModal.tsx # App settings
│   ├── services/            # Business logic
│   │   ├── JournalService.ts # Entry management
│   │   └── EncryptionService.ts # Security services
│   └── theme.ts            # App theming
├── App.tsx                 # Main app component
├── package.json           # Dependencies
└── README.md             # This file
```

## Key Components

### JournalService
Manages all journal entry operations including CRUD operations, search, and statistics.

### EncryptionService
Handles password-based encryption for securing journal entries.

### EntryEditor
Rich text editor with mood tracking, weather logging, and tag management.

### EntryViewer
Display component for reading entries with sharing and editing options.

## Data Models

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  title: string;
  content: string;        // Rich HTML content
  tags: string[];         // Organizational tags
  mood?: string;          // Emotional state
  weather?: string;       // Weather conditions
  location?: string;      // Location context
  createdAt: string;      // Creation timestamp
  updatedAt: string;      // Last modified
  isEncrypted: boolean;   // Encryption status
}
```

## Security Implementation

### Encryption
- Password-based key derivation using SHA-256
- Content encryption with secure key storage
- Automatic encryption for sensitive data

### Access Control
- Password protection for encrypted entries
- Session-based authentication
- Automatic logout after inactivity

## In-App Purchases (IAP)

### Premium Features
1. **PremiumThemes** - Additional color schemes and themes
2. **ExportPDFUnlock** - Export entries as formatted PDF documents

### Implementation
```typescript
// IAP integration would be implemented here
const premiumFeatures = {
  themes: 'PremiumThemes',
  pdfExport: 'ExportPDFUnlock'
};
```

## Performance Optimizations

- **Lazy Loading**: Load entries on demand
- **Virtual Lists**: Efficient rendering of large lists
- **Database Indexing**: Optimized search queries
- **Memory Management**: Proper cleanup and disposal

## Accessibility

- **Screen Reader Support**: VoiceOver/TalkBack compatibility
- **High Contrast**: Support for accessibility settings
- **Font Scaling**: Respect system font size preferences
- **Touch Targets**: Minimum 44pt touch areas

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and bug reports, please create an issue in the GitHub repository.

---

**Daily Journal** - Your private, secure space for thoughts and memories.