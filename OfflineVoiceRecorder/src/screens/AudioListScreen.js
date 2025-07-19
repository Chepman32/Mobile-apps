
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const db = SQLite.openDatabase(
  { name: 'audioNotes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AudioListScreen = () => {
  const [audioNotes, setAudioNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const loadAudioNotes = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS audio_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, path TEXT, duration TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM audio_notes ORDER BY timestamp DESC',
            [],
            (_, { rows }) => {
              const loadedNotes = [];
              for (let i = 0; i < rows.length; i++) {
                loadedNotes.push(rows.item(i));
              }
              setAudioNotes(loadedNotes);
            },
            (tx, error) => console.error('Error fetching audio notes', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadAudioNotes();
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [loadAudioNotes]);

  const onStartPlay = async (path, id) => {
    try {
      if (isPlaying && currentPlayingId === id) {
        await audioRecorderPlayer.stopPlayer();
        setIsPlaying(false);
        setCurrentPlayingId(null);
      } else {
        if (isPlaying) {
          await audioRecorderPlayer.stopPlayer();
        }
        await audioRecorderPlayer.startPlayer(path);
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.currentPosition === e.duration) {
            audioRecorderPlayer.stopPlayer();
            setIsPlaying(false);
            setCurrentPlayingId(null);
          }
        });
        setIsPlaying(true);
        setCurrentPlayingId(id);
      }
    } catch (err) {
      console.error('Failed to start playback:', err);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const onDeleteAudio = (id) => {
    Alert.alert(
      'Delete Audio Note',
      'Are you sure you want to delete this audio note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM audio_notes WHERE id = ?',
                [id],
                () => {
                  Alert.alert('Success', 'Audio note deleted!');
                  loadAudioNotes();
                },
                (tx, error) => console.error('Error deleting audio note', error)
              );
            });
          }
        },
      ],
      { cancelable: true }
    );
  };

  const shareAudio = async (path, title) => {
    try {
      await Share.open({
        url: `file://${path}`,
        type: 'audio/mp4', // Adjust type based on actual audio format
        title: title,
      });
    } catch (error) {
      console.error('Error sharing audio:', error);
      Alert.alert('Share Failed', 'Could not share audio.');
    }
  };

  const renderAudioNote = ({ item }) => (
    <View style={styles.audioNoteItem}>
      <Text style={styles.audioTitle}>{item.title}</Text>
      <Text style={styles.audioDuration}>{item.duration}</Text>
      <Text style={styles.audioTimestamp}>{item.timestamp}</Text>
      <View style={styles.itemControls}>
        <TouchableOpacity style={styles.playButton} onPress={() => onStartPlay(item.path, item.id)}>
          <Text style={styles.buttonText}>{isPlaying && currentPlayingId === item.id ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={() => shareAudio(item.path, item.title)}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteAudio(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={audioNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAudioNote}
        ListEmptyComponent={<Text style={styles.emptyText}>No audio notes recorded yet.</Text>}
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
  audioNoteItem: {
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
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  audioDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  audioTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  itemControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  playButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  shareButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default AudioListScreen;
