// Simple sentiment analysis service
// In a production app, this would use react-native-executorch with a real ML model
export class SentimentAnalysisService {
  private static positiveWords = [
    'happy', 'joy', 'excited', 'love', 'amazing', 'wonderful', 'great', 'excellent',
    'fantastic', 'beautiful', 'awesome', 'perfect', 'brilliant', 'delighted',
    'pleased', 'grateful', 'thankful', 'blessed', 'proud', 'accomplished',
    'successful', 'victory', 'win', 'achievement', 'progress', 'growth',
    'peaceful', 'calm', 'relaxed', 'content', 'satisfied', 'fulfilled'
  ];

  private static negativeWords = [
    'sad', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious',
    'depressed', 'upset', 'mad', 'furious', 'terrible', 'awful', 'horrible',
    'bad', 'worst', 'hate', 'disgusting', 'annoying', 'irritating',
    'stressed', 'overwhelmed', 'exhausted', 'tired', 'lonely', 'isolated',
    'rejected', 'failed', 'failure', 'loss', 'defeat', 'broken', 'hurt'
  ];

  static analyzeSentiment(text: string): {
    score: number;
    mood: string;
    confidence: number;
  } {
    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (this.positiveWords.includes(word)) {
        positiveCount++;
      } else if (this.negativeWords.includes(word)) {
        negativeCount++;
      }
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const score = totalSentimentWords > 0 
      ? (positiveCount - negativeCount) / totalSentimentWords 
      : 0;

    // Normalize score to -1 to 1 range
    const normalizedScore = Math.max(-1, Math.min(1, score));

    let mood: string;
    if (normalizedScore > 0.3) {
      mood = 'Very Positive';
    } else if (normalizedScore > 0.1) {
      mood = 'Positive';
    } else if (normalizedScore > -0.1) {
      mood = 'Neutral';
    } else if (normalizedScore > -0.3) {
      mood = 'Negative';
    } else {
      mood = 'Very Negative';
    }

    const confidence = Math.min(0.95, Math.max(0.1, totalSentimentWords / words.length));

    return {
      score: normalizedScore,
      mood,
      confidence
    };
  }

  static generatePrompts(mood: string): string[] {
    const prompts: { [key: string]: string[] } = {
      'Very Positive': [
        'What made this moment so special?',
        'How can you carry this feeling forward?',
        'What are you most grateful for today?',
        'Who would you like to share this joy with?'
      ],
      'Positive': [
        'What went well today?',
        'What small victories can you celebrate?',
        'How did you make someone else\'s day better?',
        'What are you looking forward to?'
      ],
      'Neutral': [
        'What was the highlight of your day?',
        'What did you learn about yourself today?',
        'How are you feeling right now?',
        'What would make tomorrow better?'
      ],
      'Negative': [
        'What challenged you today and how did you handle it?',
        'What support do you need right now?',
        'What would you tell a friend in your situation?',
        'What is one small thing that could improve your day?'
      ],
      'Very Negative': [
        'What feelings are you experiencing right now?',
        'Who in your life cares about you?',
        'What has helped you through difficult times before?',
        'What is one small step you could take to care for yourself?'
      ]
    };

    return prompts[mood] || prompts['Neutral'];
  }
}