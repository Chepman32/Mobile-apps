
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const FindPartnersScreen = ({ navigation }) => {
  const [partners, setPartners] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch users who speak the language current user wants to learn
    // and learn the language current user speaks
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', auth.currentUser.uid) // Exclude current user
      // More complex queries would be needed here to match languages
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedPartners = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartners(loadedPartners);
    });
    return unsubscribe;
  }, [auth.currentUser]);

  const handleChatWithPartner = (partner) => {
    navigation.navigate('Chat', { partnerId: partner.id, partnerName: partner.email });
  };

  const renderPartnerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.partnerItem}
      onPress={() => handleChatWithPartner(item)}
    >
      <Text style={styles.partnerEmail}>{item.email}</Text>
      <Text style={styles.partnerLanguages}>Learning: {item.learnLanguage} | Speaking: {item.speakLanguage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        renderItem={renderPartnerItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No partners found. Adjust your profile languages!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  partnerItem: {
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
  partnerEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  partnerLanguages: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default FindPartnersScreen;
