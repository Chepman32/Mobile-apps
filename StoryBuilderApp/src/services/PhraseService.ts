import { Category, Phrase } from '../types';

// Mock data for categories
const categories: Category[] = [
  { id: '1', name: 'Greetings', icon: '👋', count: 12 },
  { id: '2', name: 'Travel', icon: '✈️', count: 20 },
  { id: '3', name: 'Food & Dining', icon: '🍽️', count: 15 },
  { id: '4', name: 'Shopping', icon: '🛍️', count: 18 },
  { id: '5', name: 'Emergency', icon: '🆘', count: 10 },
  { id: '6', name: 'Accommodation', icon: '🏨', count: 8 },
];

// Mock data for phrases
const phrases: Record<string, Phrase[]> = {
  '1': [
    { 
      id: '1-1', 
      original: 'Hello', 
      translation: 'Hola', 
      pronunciation: 'oh-la', 
      isFavorite: false,
      categoryId: '1',
      examples: [
        { original: 'Hello, how are you?', translation: 'Hola, ¿cómo estás?' },
        { original: 'Hello, nice to meet you!', translation: '¡Hola, encantado de conocerte!' },
      ],
    },
    { 
      id: '1-2', 
      original: 'Good morning', 
      translation: 'Buenos días', 
      pronunciation: 'bweh-nos dee-as', 
      isFavorite: true,
      categoryId: '1',
      examples: [
        { original: 'Good morning, how are you?', translation: 'Buenos días, ¿cómo estás?' },
      ],
    },
    { 
      id: '1-3', 
      original: 'Good night', 
      translation: 'Buenas noches', 
      pronunciation: 'bweh-nas noh-ches', 
      isFavorite: false,
      categoryId: '1',
      examples: [
        { original: 'Good night, sweet dreams!', translation: 'Buenas noches, ¡dulces sueños!' },
      ],
    },
  ],
  '2': [
    { 
      id: '2-1', 
      original: 'Where is the airport?', 
      translation: '¿Dónde está el aeropuerto?', 
      pronunciation: 'don-deh es-ta el a-eh-ro-pwer-to', 
      isFavorite: false,
      categoryId: '2',
      examples: [],
    },
    { 
      id: '2-2', 
      original: 'How much is a ticket?', 
      translation: '¿Cuánto cuesta un boleto?', 
      pronunciation: 'kwan-to kwes-ta un bo-le-to', 
      isFavorite: false,
      categoryId: '2',
      examples: [],
    },
  ],
};

class PhraseService {
  // Get all categories
  static getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...categories]);
      }, 300); // Simulate network delay
    });
  }

  // Get phrases by category ID
  static getPhrasesByCategory(categoryId: string): Promise<Phrase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(phrases[categoryId] ? [...phrases[categoryId]] : []);
      }, 300);
    });
  }

  // Get phrase by ID
  static getPhraseById(phraseId: string): Promise<Phrase | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let foundPhrase: Phrase | undefined;
        
        // Search through all categories to find the phrase
        Object.values(phrases).some(categoryPhrases => {
          const phrase = categoryPhrases.find(p => p.id === phraseId);
          if (phrase) {
            foundPhrase = { ...phrase };
            return true;
          }
          return false;
        });
        
        resolve(foundPhrase);
      }, 200);
    });
  }

  // Toggle favorite status of a phrase
  static toggleFavorite(phraseId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let isFavorite = false;
        
        // Find and update the phrase
        Object.values(phrases).forEach(categoryPhrases => {
          const phraseIndex = categoryPhrases.findIndex(p => p.id === phraseId);
          if (phraseIndex !== -1) {
            categoryPhrases[phraseIndex].isFavorite = !categoryPhrases[phraseIndex].isFavorite;
            isFavorite = categoryPhrases[phraseIndex].isFavorite;
          }
        });
        
        resolve(isFavorite);
      }, 200);
    });
  }

  // Get favorite phrases
  static getFavoritePhrases(): Promise<Phrase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const favorites: Phrase[] = [];
        
        // Find all favorite phrases
        Object.values(phrases).forEach(categoryPhrases => {
          categoryPhrases.forEach(phrase => {
            if (phrase.isFavorite) {
              favorites.push({ ...phrase });
            }
          });
        });
        
        resolve(favorites);
      }, 300);
    });
  }
}

export default PhraseService;
