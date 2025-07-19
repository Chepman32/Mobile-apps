
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PollDetailScreen = ({ route }) => {
  const { pollId } = route.params;
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchPoll = async () => {
      const docRef = doc(db, 'polls', pollId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const pollData = { id: docSnap.id, ...docSnap.data() };
        setPoll(pollData);
        if (auth.currentUser) {
          setHasVoted(pollData.votedUsers && pollData.votedUsers.includes(auth.currentUser.uid));
        }
      } else {
        Alert.alert('Error', 'Poll not found.');
      }
    };
    fetchPoll();
  }, [pollId, auth.currentUser]);

  const handleVote = async (optionIndex) => {
    if (!auth.currentUser || !poll || hasVoted) return;

    const pollRef = doc(db, 'polls', poll.id);
    const updatedOptions = [...poll.options];
    updatedOptions[optionIndex].votes += 1;

    try {
      await updateDoc(pollRef, {
        options: updatedOptions,
        votedUsers: arrayUnion(auth.currentUser.uid),
      });
      setHasVoted(true);
      Alert.alert('Vote Cast', 'Your vote has been recorded!');
    } catch (error) {
      console.error('Error casting vote:', error);
      Alert.alert('Error', 'Failed to cast vote.');
    }
  };

  if (!poll) {
    return (
      <View style={styles.container}>
        <Text>Loading poll details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pollQuestion}>{poll.question}</Text>
      <Text style={styles.pollCreator}>Created by: {poll.createdBy}</Text>

      <Text style={styles.sectionTitle}>Options:</Text>
      {poll.options.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <TouchableOpacity
            style={[styles.optionButton, hasVoted && styles.votedOption]}
            onPress={() => handleVote(index)}
            disabled={hasVoted}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
          {hasVoted && (
            <Text style={styles.voteCount}>{option.votes} votes</Text>
          )}
        </View>
      ))}

      {hasVoted && (
        <Text style={styles.votedMessage}>You have already voted in this poll.</Text>
      )}

      <TouchableOpacity style={styles.premiumButton} onPress={() => Alert.alert('Premium', 'Purchase premium for advanced poll features.')}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  pollQuestion: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  pollCreator: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  votedOption: {
    backgroundColor: '#28a745',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voteCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  votedMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  premiumButton: {
    backgroundColor: '#ffc107',
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

export default PollDetailScreen;
