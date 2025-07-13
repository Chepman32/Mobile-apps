import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '@types/navigation';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Learn Anywhere',
    description: 'Access language lessons even without an internet connection',
    image: 'https://cdn-icons-png.flaticon.com/512/3132/3132735.png',
  },
  {
    id: '2',
    title: 'Practice Daily',
    description: 'Build a streak and improve your language skills every day',
    image: 'https://cdn-icons-png.flaticon.com/512/3132/3132735.png',
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'See your improvement with detailed statistics and achievements',
    image: 'https://cdn-icons-png.flaticon.com/512/3132/3132735.png',
  },
];

const OnboardingScreen: React.FC<ScreenProps<'Onboarding'>> = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = onboardingData;

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Onboarding completed, navigate to auth screen
      navigation.replace('Auth');
    }
  };

  const goToAuth = () => {
    navigation.replace('Auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={goToAuth}>
          <Text style={[styles.skipText, { color: colors.primary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <Image
          source={{ uri: slides[currentIndex].image }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {slides[currentIndex].title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {slides[currentIndex].description}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentIndex ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={goToNext}
        >
          <Ionicons
            name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 30,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default OnboardingScreen;
