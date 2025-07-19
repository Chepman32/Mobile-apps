
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, PanResponder } from 'react-native';
import { Svg, Line, Circle, Text as SvgText } from 'react-native-svg';
import { getRealm } from '../services/realm';

const PalaceEditorScreen = ({ route, navigation }) => {
  const { palaceId } = route.params;
  const [memoryPalace, setMemoryPalace] = useState(null);
  const [memoryItems, setMemoryItems] = useState([]);
  const [realm, setRealm] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // If no item is selected, create a new one on tap
        if (!selectedItemId) {
          addMemoryItem(gestureState.x0, gestureState.y0);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedItemId) {
          // Move the selected item
          setMemoryItems(prevItems =>
            prevItems.map(item =>
              item._id.toHexString() === selectedItemId
                ? { ...item, x: item.x + gestureState.dx, y: item.y + gestureState.dy }
                : item
            )
          );
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (selectedItemId) {
          // Save the new position to Realm
          const movedItem = memoryItems.find(item => item._id.toHexString() === selectedItemId);
          if (movedItem && realm) {
            realm.write(() => {
              movedItem.x = movedItem.x + gestureState.dx;
              movedItem.y = movedItem.y + gestureState.dy;
            });
          }
          setSelectedItemId(null);
        }
      },
    })
  ).current;

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const currentMemoryPalace = newRealm.objectForPrimaryKey('MemoryPalace', new Realm.BSON.ObjectId(palaceId));
        setMemoryPalace(currentMemoryPalace);

        const palaceItems = newRealm.objects('MemoryItem').filtered('palaceId == $0', new Realm.BSON.ObjectId(palaceId));
        setMemoryItems(Array.from(palaceItems));

        palaceItems.addListener(() => {
          setMemoryItems(Array.from(palaceItems));
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
  }, [palaceId]);

  const addMemoryItem = (x, y) => {
    if (!newItemText.trim()) {
      Alert.alert('Error', 'Memory item text cannot be empty.');
      return;
    }
    if (realm && memoryPalace) {
      realm.write(() => {
        realm.create('MemoryItem', {
          _id: new Realm.BSON.ObjectId(),
          text: newItemText,
          x: x || 100,
          y: y || 100,
          palaceId: memoryPalace._id,
        });
      });
      setNewItemText('');
    }
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted memory palace creation. (Conceptual)'
    );
    // In a real app, an AI model would suggest related concepts or placements.
  };

  if (!memoryPalace) {
    return (
      <View style={styles.container}>
        <Text>Loading memory palace...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.palaceName}>{memoryPalace.name}</Text>

      <View style={styles.editorContainer} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%">
          {memoryItems.map(item => (
            <React.Fragment key={item._id.toHexString()}>
              <Circle
                cx={item.x + 20} cy={item.y + 10}
                r={20}
                fill="lightblue"
                onPress={() => setSelectedItemId(item._id.toHexString())}
              />
              <SvgText
                x={item.x + 20} y={item.y + 15}
                textAnchor="middle"
                fontSize="10"
                fill="black"
              >
                {item.text}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="New memory item text"
          value={newItemText}
          onChangeText={setNewItemText}
        />
        <TouchableOpacity style={styles.button} onPress={() => addMemoryItem(null, null)}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
          <Text style={styles.buttonText}>AI Suggestion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  palaceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  editorContainer: {
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PalaceEditorScreen;
