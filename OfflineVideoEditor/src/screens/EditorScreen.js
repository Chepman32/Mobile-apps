
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const { width } = Dimensions.get('window');

const EditorScreen = ({ route }) => {
  const { videoUri } = route.params;
  const videoRef = useRef(null);
  const [trimmedVideoUri, setTrimmedVideoUri] = useState(videoUri);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const onVideoLoad = (data) => {
    setVideoDuration(data.duration);
    setTrimEnd(data.duration);
  };

  const handleTrim = async () => {
    if (trimStart >= trimEnd) {
      Alert.alert('Error', 'Trim start must be less than trim end.');
      return;
    }

    Alert.alert(
      'Trimming Video',
      `Simulating video trim from ${trimStart.toFixed(1)}s to ${trimEnd.toFixed(1)}s. (Conceptual)`
    );

    // In a real app, you would use a native module (e.g., FFmpeg wrapper) to trim the video.
    // For demonstration, we'll just simulate a new URI.
    const newUri = `${RNFS.DocumentDirectoryPath}/trimmed_video_${Date.now()}.mp4`;
    setTrimmedVideoUri(newUri);
    Alert.alert('Trim Complete', 'Video trimmed successfully!');
  };

  const saveVideo = () => {
    Alert.alert('Video Saved', `Edited video saved to: ${trimmedVideoUri}. (Conceptual)`);
    // In a real app, you'd save the trimmedVideoUri to device storage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Video</Text>
      <Video
        ref={videoRef}
        source={{ uri: trimmedVideoUri }}
        style={styles.videoPlayer}
        resizeMode="contain"
        controls={true}
        onLoad={onVideoLoad}
      />

      <View style={styles.trimControls}>
        <Text>Start: </Text>
        <TextInput
          style={styles.trimInput}
          keyboardType="numeric"
          value={trimStart.toString()}
          onChangeText={(text) => setTrimStart(parseFloat(text) || 0)}
        />
        <Text>End: </Text>
        <TextInput
          style={styles.trimInput}
          keyboardType="numeric"
          value={trimEnd.toString()}
          onChangeText={(text) => setTrimEnd(parseFloat(text) || 0)}
        />
        <TouchableOpacity style={styles.trimButton} onPress={handleTrim}>
          <Text style={styles.buttonText}>Trim</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={saveVideo}>
          <Text style={styles.buttonText}>Save Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Feature', 'Add Music/Text Overlay (Conceptual)')}>
          <Text style={styles.buttonText}>Add Music/Text</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoPlayer: {
    width: width * 0.9,
    height: width * 0.9 * (9 / 16), // 16:9 aspect ratio
    backgroundColor: 'black',
    marginBottom: 20,
  },
  trimControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  trimInput: {
    width: 60,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  trimButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default EditorScreen;
