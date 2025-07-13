import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

const ResultsScreen: React.FC<ScreenProps<'Results'>> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { score, totalQuestions, categoryId } = route.params;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine result message based on score
  const getResultMessage = () => {
    if (percentage >= 80) return 'Excellent Work!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Not Bad!';
    return 'Keep Practicing!';
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I scored ${score} out of ${totalQuestions} (${percentage}%) in the language learning quiz! Can you beat my score?`,
        title: 'My Quiz Results',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRetry = () => {
    navigation.replace('Quiz', { categoryId, categoryName: 'Quiz' });
  };

  const handleGoHome = () => {
    navigation.navigate('Main');
  };

  // Determine result emoji and color
  const getResultEmoji = () => {
    if (percentage >= 80) return { emoji: '🎉', color: colors.success };
    if (percentage >= 60) return { emoji: '👍', color: colors.info };
    if (percentage >= 40) return { emoji: '😊', color: colors.warning };
    return { emoji: '💪', color: colors.error };
  };

  const { emoji, color } = getResultEmoji();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Quiz Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Result Emoji */}
        <View style={[styles.emojiContainer, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.emoji, { color }]}>{emoji}</Text>
        </View>

        {/* Result Message */}
        <Text style={[styles.resultMessage, { color: colors.text }]}>
          {getResultMessage()}
        </Text>

        {/* Score Circle */}
        <View style={styles.scoreContainer}>
          <View 
            style={[
              styles.scoreCircle, 
              { 
                borderColor: color,
                shadowColor: color,
              }
            ]}
          >
            <Text style={[styles.scoreText, { color }]}>{percentage}%</Text>
            <Text style={[styles.scoreSubtext, { color: colors.textSecondary }]}>
              {score} / {totalQuestions} correct
            </Text>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: colors.card }]}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color={colors.primary} />
          <Text style={[styles.shareButtonText, { color: colors.primary, marginLeft: 8 }]}>
            Share Your Score
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card, marginLeft: 12 }]}
            onPress={handleGoHome}
          >
            <Ionicons name="home" size={20} color={colors.primary} style={styles.buttonIcon} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Review Section */}
        <View style={[styles.reviewContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>
            How was your experience?
          </Text>
          <Text style={[styles.reviewSubtitle, { color: colors.textSecondary }]}>
            Rate this quiz to help us improve
          </Text>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} style={styles.starButton}>
                <Ionicons 
                  name={star <= 3 ? 'star' : 'star-outline'} 
                  size={28} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
  },
  resultMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  scoreContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  scoreSubtext: {
    fontSize: 16,
    marginTop: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 32,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
});

export default ResultsScreen;
