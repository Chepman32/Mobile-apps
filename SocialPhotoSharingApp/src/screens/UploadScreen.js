
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UploadScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const uploadPost = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${auth.currentUser.uid}/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
        imageUrl: downloadURL,
        caption: caption,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Photo uploaded successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <TextInput
        style={styles.captionInput}
        placeholder="Add a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadPost} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Upload Post</Text>
        )}
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
  selectImageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  captionInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
});

export default UploadScreen;
