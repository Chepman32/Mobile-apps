
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import { Button } from 'react-native-paper';

const phrases = [
  { id: '1', text: 'Hello, how are you?', translation: 'Hola, ¿cómo estás?', language: 'es-ES' },
  { id: '2', text: 'Thank you very much.', translation: 'Muchas gracias.', language: 'es-ES' },
  { id: '3', text: 'Where is the bathroom?', translation: '¿Dónde está el baño?', language: 'es-ES' },
];

const PracticeScreen = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setRecognizedText(e.value[0]);
      checkPronunciation(e.value[0]);
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };
    Voice.onSpeechError = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
      setFeedback('Could not recognize speech. Please try again.');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentPhraseIndex]);

  const startListening = async () => {
    setRecognizedText('');
    setFeedback('');
    try {
      await Voice.start(phrases[currentPhraseIndex].language);
      setIsListening(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to start speech recognition.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const speakPhrase = (text, language) => {
    Tts.speak(text, { language: language });
  };

  const checkPronunciation = (spokenText) => {
    const targetText = phrases[currentPhraseIndex].translation;
    // Simple comparison for now. AI would do more advanced analysis.
    if (spokenText.toLowerCase().includes(targetText.toLowerCase())) {
      setFeedback('Excellent! Your pronunciation is clear.');
    } else {
      setFeedback('Try again. Focus on the pronunciation of: ' + targetText);
    }
  };

  const nextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
      setRecognizedText('');
      setFeedback('');
    } else {
      Alert.alert('Practice Complete', 'You have completed all phrases in this session!');
      setCurrentPhraseIndex(0); // Loop back to start
    }
  };

  const currentPhrase = phrases[currentPhraseIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.phraseText}>Phrase: {currentPhrase.text}</Text>
      <Text style={styles.translationText}>Translation: {currentPhrase.translation}</Text>

      <Button mode="contained" onPress={() => speakPhrase(currentPhrase.translation, currentPhrase.language)} style={styles.button}>
        Listen to Translation
      </Button>

      <Button mode="contained" onPress={isListening ? stopListening : startListening} style={styles.button}>
        {isListening ? 'Stop Speaking' : 'Speak Now'}
      </Button>

      {recognizedText ? <Text style={styles.recognizedText}>You said: {recognizedText}</Text> : null}
      {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}

      <Button mode="contained" onPress={nextPhrase} style={styles.button}>
        Next Phrase
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  phraseText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  translationText: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    marginTop: 15,
    width: '80%',
  },
  recognizedText: {
    marginTop: 20,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
  },
  feedbackText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#28a745',
  },
});

export default PracticeScreen;
