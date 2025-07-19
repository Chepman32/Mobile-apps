
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import LottieView from 'lottie-react-native';
import Voice from 'react-native-voice';
import Realm from 'realm';
import PushNotification from 'react-native-push-notification';

// Define Realm Schema
const PetSchema = {
  name: 'Pet',
  properties: {
    _id: 'objectId',
    name: 'string',
    personality: 'string',
    hunger: 'int',
    happiness: 'int',
    lastInteraction: 'date',
  },
};

const InteractionSchema = {
  name: 'Interaction',
  properties: {
    _id: 'objectId',
    petId: 'objectId',
    type: 'string', // e.g., 'feed', 'play', 'talk'
    timestamp: 'date',
    details: 'string?',
  },
};

const PetScreen = ({ navigation }) => {
  const [pet, setPet] = useState(null);
  const [realm, setRealm] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'aipetcompanion.realm',
          schema: [PetSchema, InteractionSchema],
        });
        setRealm(newRealm);

        let currentPet = newRealm.objects('Pet')[0];
        if (!currentPet) {
          newRealm.write(() => {
            currentPet = newRealm.create('Pet', {
              _id: new Realm.BSON.ObjectId(),
              name: 'Buddy',
              personality: 'friendly',
              hunger: 50,
              happiness: 50,
              lastInteraction: new Date(),
            });
          });
        }
        setPet(currentPet);

        newRealm.objects('Pet').addListener(() => {
          setPet(newRealm.objects('Pet')[0]);
        });
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setRecognizedText(e.value[0]);
    };
    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };
    Voice.onSpeechError = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setRecognizedText('');
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error(e);
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

  const handleInteraction = (type) => {
    if (realm && pet) {
      realm.write(() => {
        pet.lastInteraction = new Date();
        // Simulate personality/stat changes based on interaction
        if (type === 'feed') {
          pet.hunger = Math.max(0, pet.hunger - 20);
          pet.happiness = Math.min(100, pet.happiness + 10);
          animationRef.current?.play(); // Play a feeding animation
        } else if (type === 'play') {
          pet.happiness = Math.min(100, pet.happiness + 20);
          pet.hunger = Math.min(100, pet.hunger + 5);
          animationRef.current?.play(); // Play a playing animation
        } else if (type === 'talk') {
          // AI logic would go here to process recognizedText
          // For now, just update happiness
          pet.happiness = Math.min(100, pet.happiness + 5);
        }
        realm.create('Interaction', {
          _id: new Realm.BSON.ObjectId(),
          petId: pet._id,
          type: type,
          timestamp: new Date(),
          details: recognizedText || '',
        });
      });
      Alert.alert('Interaction', `You ${type}ed your pet!`);
      setRecognizedText('');
    }
  };

  const scheduleNotifications = () => {
    PushNotification.localNotificationSchedule({
      message: `${pet?.name} is hungry!`, // (required)
      date: new Date(Date.now() + 60 * 1000 * 60 * 4), // 4 hours from now
      repeatType: 'time',
      repeatTime: 1000 * 60 * 60 * 8, // Every 8 hours
    });
    Alert.alert('Notifications Scheduled', 'You will receive reminders about your pet's needs.');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium breeds, cosmetics, etc.'
    );
  };

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Loading pet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.petName}>{pet.name}</Text>
      <LottieView
        ref={animationRef}
        source={require('../assets/lottie/cat_animation.json')} // Placeholder Lottie animation
        autoPlay
        loop
        style={styles.petAnimation}
      />
      <Text>Hunger: {pet.hunger}%</Text>
      <Text>Happiness: {pet.happiness}%</Text>
      <Text>Personality: {pet.personality}</Text>
      <Text>Last Interaction: {new Date(pet.lastInteraction).toLocaleString()}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => handleInteraction('feed')}>
          <Text style={styles.buttonText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleInteraction('play')}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={isListening ? stopListening : startListening}>
          <Text style={styles.buttonText}>{isListening ? 'Stop Listening' : 'Talk'}</Text>
        </TouchableOpacity>
      </View>
      {recognizedText ? <Text style={styles.recognizedText}>You said: {recognizedText}</Text> : null}

      <TouchableOpacity style={styles.notificationButton} onPress={scheduleNotifications}>
        <Text style={styles.buttonText}>Schedule Reminders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
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
  petName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  petAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recognizedText: {
    marginTop: 10,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
  notificationButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default PetScreen;
