
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const TakeSurveyScreen = ({ route, navigation }) => {
  const { surveyId } = route.params;
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchSurvey = async () => {
      const docRef = doc(db, 'surveys', surveyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSurvey({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Survey not found.');
        navigation.goBack();
      }
    };
    fetchSurvey();
  }, [surveyId]);

  const handleAnswerChange = (questionIndex, text) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: text,
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!survey) return;

    // Basic validation: ensure all questions are answered
    for (let i = 0; i < survey.questions.length; i++) {
      if (!answers[i] || answers[i].trim() === '') {
        Alert.alert('Error', 'Please answer all questions.');
        return;
      }
    }

    try {
      await addDoc(collection(db, 'surveys', survey.id, 'responses'), {
        answers: answers,
        timestamp: serverTimestamp(),
      });

      // Increment response count on the survey document
      const surveyRef = doc(db, 'surveys', survey.id);
      await updateDoc(surveyRef, {
        responseCount: (survey.responseCount || 0) + 1,
      });

      Alert.alert('Success', 'Survey submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting survey:', error);
      Alert.alert('Error', 'Failed to submit survey.');
    }
  };

  if (!survey) {
    return (
      <View style={styles.container}>
        <Text>Loading survey...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.surveyTitle}>{survey.title}</Text>

      {survey.questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{index + 1}. {question.text}</Text>
          <TextInput
            style={styles.answerInput}
            placeholder="Your answer..."
            value={answers[index] || ''}
            onChangeText={(text) => handleAnswerChange(index, text)}
            multiline
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitSurvey}>
        <Text style={styles.buttonText}>Submit Survey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  surveyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TakeSurveyScreen;
