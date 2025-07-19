
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, PanResponder } from 'react-native';
import { Svg, Line, Circle, Text as SvgText } from 'react-native-svg';
import { getRealm } from '../services/realm';

const MindMapEditorScreen = ({ route, navigation }) => {
  const { mindMapId } = route.params;
  const [mindMap, setMindMap] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [realm, setRealm] = useState(null);
  const [newNodeText, setNewNodeText] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // If no node is selected, create a new one on tap
        if (!selectedNodeId) {
          addNode(gestureState.x0, gestureState.y0);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedNodeId) {
          // Move the selected node
          setNodes(prevNodes =>
            prevNodes.map(node =>
              node._id.toHexString() === selectedNodeId
                ? { ...node, x: node.x + gestureState.dx, y: node.y + gestureState.dy }
                : node
            )
          );
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (selectedNodeId) {
          // Save the new position to Realm
          const movedNode = nodes.find(node => node._id.toHexString() === selectedNodeId);
          if (movedNode && realm) {
            realm.write(() => {
              movedNode.x = movedNode.x + gestureState.dx;
              movedNode.y = movedNode.y + gestureState.dy;
            });
          }
          setSelectedNodeId(null);
        }
      },
    })
  ).current;

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const currentMindMap = newRealm.objectForPrimaryKey('MindMap', new Realm.BSON.ObjectId(mindMapId));
        setMindMap(currentMindMap);

        const mindMapNodes = newRealm.objects('MindMapNode').filtered('mindMapId == $0', new Realm.BSON.ObjectId(mindMapId));
        setNodes(Array.from(mindMapNodes));

        mindMapNodes.addListener(() => {
          setNodes(Array.from(mindMapNodes));
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
  }, [mindMapId]);

  const addNode = (x, y, parentId = null) => {
    if (!newNodeText.trim()) {
      Alert.alert('Error', 'Node text cannot be empty.');
      return;
    }
    if (realm && mindMap) {
      realm.write(() => {
        realm.create('MindMapNode', {
          _id: new Realm.BSON.ObjectId(),
          text: newNodeText,
          x: x || 100,
          y: y || 100,
          parentId: parentId ? new Realm.BSON.ObjectId(parentId) : null,
          mindMapId: mindMap._id,
        });
      });
      setNewNodeText('');
    }
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-generated suggestions. (Conceptual)'
    );
    // In a real app, an AI model would suggest related concepts
  };

  if (!mindMap) {
    return (
      <View style={styles.container}>
        <Text>Loading mind map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mindMapName}>{mindMap.name}</Text>

      <View style={styles.editorContainer} {...panResponder.panHandlers}>
        <Svg height="100%" width="100%">
          {nodes.map(node => {
            const parent = nodes.find(p => p._id.toHexString() === node.parentId?.toHexString());
            return (
              <React.Fragment key={node._id.toHexString()}>
                {parent && (
                  <Line
                    x1={parent.x + 50} y1={parent.y + 20} // Adjust for node size
                    x2={node.x + 50} y2={node.y + 20}
                    stroke="black"
                    strokeWidth="2"
                  />
                )}
                <Circle
                  cx={node.x + 50} cy={node.y + 20}
                  r={20}
                  fill="lightblue"
                  onPress={() => setSelectedNodeId(node._id.toHexString())}
                />
                <SvgText
                  x={node.x + 50} y={node.y + 25}
                  textAnchor="middle"
                  fontSize="12"
                  fill="black"
                >
                  {node.text}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="New node text"
          value={newNodeText}
          onChangeText={setNewNodeText}
        />
        <TouchableOpacity style={styles.button} onPress={() => addNode(null, null, selectedNodeId)}>
          <Text style={styles.buttonText}>Add Node</Text>
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
  mindMapName: {
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

export default MindMapEditorScreen;
