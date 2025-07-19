
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const eventData = { id: docSnap.id, ...docSnap.data() };
        setEvent(eventData);
        if (auth.currentUser) {
          setHasRSVPed(eventData.rsvps && eventData.rsvps.includes(auth.currentUser.uid));
        }
      } else {
        Alert.alert('Error', 'Event not found.');
      }
    };
    fetchEvent();
  }, [eventId, auth.currentUser]);

  const handleRSVP = async () => {
    if (!auth.currentUser || !event) return;

    const eventRef = doc(db, 'events', event.id);
    try {
      if (hasRSVPed) {
        await updateDoc(eventRef, {
          rsvps: arrayRemove(auth.currentUser.uid),
        });
        setHasRSVPed(false);
        Alert.alert('RSVP Updated', 'You have un-RSVPed for this event.');
      } else {
        await updateDoc(eventRef, {
          rsvps: arrayUnion(auth.currentUser.uid),
        });
        setHasRSVPed(true);
        Alert.alert('RSVP Updated', 'You have RSVPed for this event!');
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      Alert.alert('Error', 'Failed to update RSVP.');
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventDetail}>Date: {event.date}</Text>
      <Text style={styles.eventDetail}>Location: {event.location}</Text>
      <Text style={styles.eventDetail}>Description: {event.description}</Text>
      <Text style={styles.eventDetail}>Created by: {event.createdBy}</Text>

      <Text style={styles.sectionTitle}>Attendees: {event.rsvps ? event.rsvps.length : 0}</Text>

      <TouchableOpacity
        style={[styles.rsvpButton, hasRSVPed ? styles.rsvpedButton : null]}
        onPress={handleRSVP}
      >
        <Text style={styles.buttonText}>{hasRSVPed ? 'Cancel RSVP' : 'RSVP'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={() => Alert.alert('Premium', 'Purchase premium for advanced event features.')}>
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
  eventName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  eventDetail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  rsvpButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  rsvpedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default EventDetailScreen;
