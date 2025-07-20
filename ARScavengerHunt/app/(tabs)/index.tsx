import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface HuntItem {
  id: string;
  name: string;
  description: string;
  found: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  clue: string;
  points: number;
}

interface Hunt {
  id: string;
  title: string;
  description: string;
  items: HuntItem[];
  totalPoints: number;
  completed: boolean;
}

export default function ARScavengerHuntScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [currentHunt, setCurrentHunt] = useState<Hunt | null>(null);
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Sample hunt data
  const sampleHunt: Hunt = {
    id: '1',
    title: 'Campus Treasure Hunt',
    description: 'Find hidden items around the campus using AR clues',
    totalPoints: 500,
    completed: false,
    items: [
      {
        id: '1',
        name: 'Golden Compass',
        description: 'A mysterious compass pointing to hidden treasures',
        found: false,
        location: { latitude: 37.7749, longitude: -122.4194 },
        clue: 'Look for the old oak tree near the library entrance',
        points: 100,
      },
      {
        id: '2',
        name: 'Ancient Map',
        description: 'A weathered map with cryptic symbols',
        found: false,
        location: { latitude: 37.7750, longitude: -122.4195 },
        clue: 'Check the fountain area for a stone marker',
        points: 150,
      },
      {
        id: '3',
        name: 'Crystal Key',
        description: 'A translucent key that glows in the dark',
        found: false,
        location: { latitude: 37.7751, longitude: -122.4196 },
        clue: 'Search near the student center entrance',
        points: 200,
      },
    ],
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    
    setCurrentHunt(sampleHunt);
  }, []);

  const startHunt = () => {
    setShowCamera(true);
    setFoundItems([]);
    setScore(0);
  };

  const findItem = (itemId: string) => {
    if (!currentHunt) return;

    const item = currentHunt.items.find(i => i.id === itemId);
    if (item && !foundItems.includes(itemId)) {
      setFoundItems([...foundItems, itemId]);
      setScore(score + item.points);
      
      Alert.alert(
        'Item Found! 🎉',
        `You found the ${item.name}! +${item.points} points`,
        [{ text: 'Continue', style: 'default' }]
      );

      // Check if hunt is completed
      if (foundItems.length + 1 >= currentHunt.items.length) {
        completeHunt();
      }
    }
  };

  const completeHunt = () => {
    Alert.alert(
      'Hunt Completed! 🏆',
      `Congratulations! You've completed the hunt with ${score} points!`,
      [
        {
          text: 'View Results',
          onPress: () => setShowCamera(false),
        },
      ]
    );
  };

  const renderCameraView = () => {
    if (!hasPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera permission is required for AR features
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={cameraType}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>AR Hunt Mode</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{score} pts</Text>
              </View>
            </View>
            
            <View style={styles.arOverlay}>
              <View style={styles.arTarget}>
                <Ionicons name="locate" size={40} color="#00ff00" />
                <Text style={styles.arText}>Point camera at target</Text>
              </View>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => {
                  setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => findItem('1')} // Simulate finding an item
              >
                <Ionicons name="scan" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  };

  const renderHuntList = () => {
    if (!currentHunt) return null;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentHunt.title}</Text>
          <Text style={styles.description}>{currentHunt.description}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{foundItems.length}</Text>
              <Text style={styles.statLabel}>Found</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentHunt.items.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{score}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Hunt Items</Text>
          {currentHunt.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemStatus}>
                  {foundItems.includes(item.id) ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#666" />
                  )}
                </View>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemClue}>Clue: {item.clue}</Text>
              <Text style={styles.itemPoints}>+{item.points} points</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startHunt}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.startButtonText}>Start AR Hunt</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (showCamera) {
    return renderCameraView();
  }

  return renderHuntList();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#b8b8b8',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#b8b8b8',
    marginTop: 4,
  },
  itemsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  itemStatus: {
    alignItems: 'center',
  },
  itemDescription: {
    fontSize: 14,
    color: '#b8b8b8',
    marginBottom: 8,
  },
  itemClue: {
    fontSize: 12,
    color: '#ffd700',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemPoints: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#e94560',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  closeButton: {
    padding: 8,
  },
  cameraTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arTarget: {
    alignItems: 'center',
  },
  arText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  controlButton: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  scanButton: {
    padding: 20,
    backgroundColor: '#e94560',
    borderRadius: 35,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e94560',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
