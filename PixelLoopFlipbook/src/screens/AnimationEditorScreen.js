
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import Canvas from 'react-native-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 40; // 20 padding on each side

const AnimationEditorScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const canvasRef = useRef(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [frames, setFrames] = useState([]); // Array of base64 image data for frames
  const [isProUser, setIsProUser] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProjectAndUserStatus = async () => {
      const storedProjects = await AsyncStorage.getItem('animationProjects');
      const projects = storedProjects ? JSON.parse(storedProjects) : [];
      const currentProject = projects.find(p => p.id === projectId);
      setProject(currentProject);

      if (currentProject && currentProject.frames) {
        setFrames(currentProject.frames);
      }

      const proStatus = await AsyncStorage.getItem('isProUser');
      setIsProUser(proStatus === 'true');
    };
    loadProjectAndUserStatus();
  }, [projectId]);

  const saveProject = async (updatedFrames) => {
    if (!project) return;
    const storedProjects = await AsyncStorage.getItem('animationProjects');
    let projects = storedProjects ? JSON.parse(storedProjects) : [];
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].frames = updatedFrames;
      await AsyncStorage.setItem('animationProjects', JSON.stringify(projects));
      setProject(projects[projectIndex]);
    }
  };

  const handleCanvas = (canvas) => {
    if (canvas) {
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load current frame if exists
      if (frames[currentFrameIndex]) {
        const img = new Image();
        img.src = frames[currentFrameIndex];
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  };

  const addFrame = async () => {
    if (!isProUser && frames.length >= (project?.frameLimit || 50)) {
      Alert.alert('Frame Limit Reached', 'Upgrade to Animator Pro for unlimited frames!');
      return;
    }
    const newFrames = [...frames, '']; // Add an empty frame
    setFrames(newFrames);
    setCurrentFrameIndex(newFrames.length - 1);
    await saveProject(newFrames);
  };

  const deleteFrame = async () => {
    if (frames.length <= 1) {
      Alert.alert('Cannot Delete', 'You must have at least one frame.');
      return;
    }
    Alert.alert(
      'Delete Frame',
      'Are you sure you want to delete this frame?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const newFrames = frames.filter((_, index) => index !== currentFrameIndex);
            setFrames(newFrames);
            setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
            await saveProject(newFrames);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const goToNextFrame = () => {
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    }
  };

  const goToPreviousFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
    }
  };

  const exportAnimation = () => {
    const exportQuality = isProUser ? '4K' : (project?.exportLimit || '720p');
    Alert.alert(
      'Export Animation',
      `Simulating export at ${exportQuality} quality. In a real app, this would generate a video file.`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.frameCounter}>Frame {currentFrameIndex + 1} / {frames.length}</Text>
      <View style={styles.canvasContainer}>
        <Canvas ref={handleCanvas} style={styles.canvas} />
        <Text style={styles.drawingHint}>Draw on this canvas (conceptual)</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={goToPreviousFrame}>
          <Text style={styles.controlButtonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={addFrame}>
          <Text style={styles.controlButtonText}>Add Frame</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={deleteFrame}>
          <Text style={styles.controlButtonText}>Delete Frame</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={goToNextFrame}>
          <Text style={styles.controlButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportAnimation}>
        <Text style={styles.exportButtonText}>Export Animation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  frameCounter: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  canvasContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  drawingHint: {
    position: 'absolute',
    color: '#aaa',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AnimationEditorScreen;
