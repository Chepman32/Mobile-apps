
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const SurveyListScreen = ({ navigation }) => {
  const [surveys, setSurveys] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'surveys'),
      where('createdBy', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedSurveys = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSurveys(loadedSurveys);
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const renderSurveyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surveyItem}
      onPress={() => navigation.navigate('SurveyResults', { surveyId: item.id, surveyTitle: item.title })}
    >
      <Text style={styles.surveyTitle}>{item.title}</Text>
      <Text style={styles.surveyQuestions}>{item.questions.length} questions</Text>
      <Text style={styles.surveyResponses}>{item.responseCount || 0} responses</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={surveys}
        keyExtractor={(item) => item.id}
        renderItem={renderSurveyItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No surveys yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateSurvey')}>
        <Text style={styles.buttonText}>Create New Survey</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  surveyItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  surveyQuestions: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  surveyResponses: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
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
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default SurveyListScreen;
