import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

// Mock data - in a real app, this would come from an API or local database
const quizQuestions = {
  '1': [
    {
      id: '1',
      question: 'What does "Hola" mean in English?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correctAnswer: 0,
      image: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
    },
    {
      id: '2',
      question: 'How do you say "Thank you" in Spanish?',
      options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
      correctAnswer: 2,
      image: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
    },
    // Add more questions here
  ],
  '2': [
    // Intermediate questions
  ],
  '3': [
    // Advanced questions
  ],
};

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
};

const QuizScreen: React.FC<ScreenProps<'Quiz'>> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { categoryId, categoryName } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  // Load questions based on category
  useEffect(() => {
    // Simulate API call
    const loadQuestions = () => {
      setTimeout(() => {
        const categoryQuestions = quizQuestions[categoryId as keyof typeof quizQuestions] || [];
        setQuestions(categoryQuestions);
        setIsLoading(false);
      }, 500);
    };

    loadQuestions();
  }, [categoryId]);

  // Timer effect
  useEffect(() => {
    if (isLoading || isAnswered || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswered, questions.length, isLoading]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    // Update score if answer is correct
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      // Quiz completed
      navigation.replace('Results', {
        score,
        totalQuestions: questions.length,
        categoryId,
      });
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return [styles.option, { borderColor: colors.border }];
    }

    if (index === currentQuestion.correctAnswer) {
      return [styles.option, styles.correctOption, { borderColor: colors.success }];
    }

    if (index === selectedOption && index !== currentQuestion.correctAnswer) {
      return [styles.option, styles.wrongOption, { borderColor: colors.error }];
    }

    return [styles.option, { borderColor: colors.border }];
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="sad-outline" size={60} color={colors.textSecondary} style={{ marginBottom: 20 }} />
        <Text style={[styles.noQuestionsText, { color: colors.text }]}>
          No questions available for this category yet.
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.categoryName, { color: colors.primary }]}>{categoryName}</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color={colors.primary} style={styles.timerIcon} />
          <Text style={[styles.timerText, { color: colors.primary }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: `${colors.primary}20` }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentQuestionIndex) / questions.length) * 100}%`,
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        {currentQuestion.image && (
          <Image 
            source={{ uri: currentQuestion.image }} 
            style={styles.questionImage} 
            resizeMode="contain"
          />
        )}
        <Text style={[styles.questionText, { color: colors.text }]}>
          {currentQuestion.question}
        </Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => handleSelectOption(index)}
            disabled={isAnswered}
          >
            <View style={[styles.optionRadio, { borderColor: colors.primary }]}>
              {selectedOption === index && (
                <View style={[styles.optionRadioFill, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            
            {isAnswered && index === currentQuestion.correctAnswer && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={colors.success} 
                style={styles.optionIcon} 
              />
            )}
            
            {isAnswered && 
              index === selectedOption && 
              index !== currentQuestion.correctAnswer && (
                <Ionicons 
                  name="close-circle" 
                  size={24} 
                  color={colors.error} 
                  style={styles.optionIcon} 
                />
              )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { 
              backgroundColor: isAnswered ? colors.primary : colors.disabled,
              opacity: isAnswered ? 1 : 0.7,
            },
          ]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  backButton: {
    padding: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerIcon: {
    marginRight: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  questionContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  questionImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  correctOption: {
    backgroundColor: 'rgba(75, 181, 67, 0.1)',
    borderColor: '#4BB543',
  },
  wrongOption: {
    backgroundColor: 'rgba(239, 35, 60, 0.1)',
    borderColor: '#EF233C',
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionRadioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  optionIcon: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  noQuestionsText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen;
