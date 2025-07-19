
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker from 'react-native-document-picker';
import RenderHtml from 'react-native-render-html';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const audioRecorderPlayer = new AudioRecorderPlayer();

const NoteEditorScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalPlaybackTime, setTotalPlaybackTime] = useState(0);
  const [attachedFile, setAttachedFile] = useState(null);

  const loadNote = useCallback(async () => {
    const storedNotes = await AsyncStorage.getItem('notes');
    const notes = storedNotes ? JSON.parse(storedNotes) : [];
    const currentNote = notes.find(n => n.id === noteId);
    if (currentNote) {
      setNote(currentNote);
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setAttachedFile(currentNote.attachedFile || null);
    }
  }, [noteId]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  const saveNote = async () => {
    if (!note) return;
    const updatedNote = { ...note, title, content, attachedFile };
    const storedNotes = await AsyncStorage.getItem('notes');
    let notes = storedNotes ? JSON.parse(storedNotes) : [];
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = updatedNote;
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      Alert.alert('Success', 'Note saved!');
    }
  };

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        // console.log('Recording: ', e.currentPosition);
      });
      setIsRecording(true);
      console.log(result);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      if (note) {
        const updatedNote = { ...note, audioMemo: result };
        setNote(updatedNote);
        saveNote(updatedNote); // Save note with audio memo
      }
      console.log(result);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const onStartPlay = async () => {
    if (!note || !note.audioMemo) {
      Alert.alert('No Audio', 'No voice memo recorded for this note.');
      return;
    }
    try {
      await audioRecorderPlayer.startPlayer(note.audioMemo);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentPlaybackTime(e.currentPosition);
        setTotalPlaybackTime(e.duration);
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
        }
      });
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to start playback:', err);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop playback:', err);
      Alert.alert('Error', 'Failed to stop playback.');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (note) {
        const updatedNote = { ...note, attachedFile: res[0] };
        setNote(updatedNote);
        saveNote(updatedNote);
        Alert.alert('File Attached', `Attached: ${res[0].name}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Document picker error:', err);
        Alert.alert('Error', 'Failed to pick document.');
      }
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading note...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        onBlur={saveNote} // Save on blur
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Note content..."
        multiline
        value={content}
        onChangeText={setContent}
        onBlur={saveNote} // Save on blur
      />

      <Text style={styles.sectionTitle}>Voice Memo:</Text>
      <View style={styles.audioControls}>
        <TouchableOpacity style={styles.audioButton} onPress={isRecording ? onStopRecord : onStartRecord}>
          <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
        {note.audioMemo && (
          <TouchableOpacity style={styles.audioButton} onPress={isPlaying ? onStopPlay : onStartPlay}>
            <Text style={styles.buttonText}>{isPlaying ? 'Stop Playback' : 'Play Memo'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {isPlaying && (
        <Text style={styles.playbackTime}>
          {audioRecorderPlayer.mmss(Math.floor(currentPlaybackTime / 1000))} / {audioRecorderPlayer.mmss(Math.floor(totalPlaybackTime / 1000))}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Attachments:</Text>
      {attachedFile ? (
        <View style={styles.attachedFileContainer}>
          <Text style={styles.attachedFileName}>{attachedFile.name}</Text>
          <TouchableOpacity onPress={() => setAttachedFile(null)}>
            <Text style={styles.removeFileText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
          <Text style={styles.buttonText}>Attach File</Text>
        </TouchableOpacity>
      )}

      {/* Placeholder for rich text editor - would replace contentInput */}
      <Text style={styles.sectionTitle}>Formatted Note (Conceptual):</Text>
      <RenderHtml
        contentWidth={width - 40}
        source={{ html: `<p>This is a <b>conceptual</b> rich text editor area. Actual rich text editing would use a dedicated library.</p><p>Current content: ${content}</p>` }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  audioButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playbackTime: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    color: '#666',
  },
  attachButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  attachedFileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  attachedFileName: {
    fontSize: 16,
    flexShrink: 1,
  },
  removeFileText: {
    color: 'red',
    marginLeft: 10,
  },
});

export default NoteEditorScreen;
