
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const SurveyResultsScreen = ({ route }) => {
  const { surveyId, surveyTitle } = route.params;
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchSurvey = async () => {
      const docRef = doc(db, 'surveys', surveyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSurvey({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Error', 'Survey not found.');
      }
    };
    fetchSurvey();

    const q = query(collection(db, 'surveys', surveyId, 'responses'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedResponses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResponses(loadedResponses);
    });
    return unsubscribe;
  }, [surveyId]);

  const getQuestionAnalysis = (questionIndex) => {
    const questionResponses = responses.map(res => res.answers[questionIndex]);
    const responseCounts = {};
    questionResponses.forEach(answer => {
      responseCounts[answer] = (responseCounts[answer] || 0) + 1;
    });

    const chartData = Object.keys(responseCounts).map((answer, index) => ({
      name: answer,
      population: responseCounts[answer],
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
    return chartData;
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  if (!survey) {
    return (
      <View style={styles.container}>
        <Text>Loading survey results...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{survey.title} Results</Text>
      <Text style={styles.responseCount}>Total Responses: {responses.length}</Text>

      {survey.questions.map((question, index) => (
        <View key={index} style={styles.questionResultsContainer}>
          <Text style={styles.questionText}>{index + 1}. {question.text}</Text>
          {getQuestionAnalysis(index).length > 0 ? (
            <PieChart
              data={getQuestionAnalysis(index)}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          ) : (
            <Text style={styles.noDataText}>No responses for this question yet.</Text>
          )}
        </View>
      ))}

      <Text style={styles.infoText}>Advanced analytics and export options available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  responseCount: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  questionResultsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default SurveyResultsScreen;
