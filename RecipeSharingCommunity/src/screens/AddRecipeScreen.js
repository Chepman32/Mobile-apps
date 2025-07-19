import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddRecipeScreen = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);
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

  const handleAddRecipe = async () => {
    if (!recipeName.trim() || !ingredients.trim() || !instructions.trim()) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setUploading(true);
    let imageUrl = null;
    if (imageUri) {
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `recipe_images/${auth.currentUser.uid}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Image upload error:', error);
        Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
        setUploading(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        name: recipeName,
        ingredients: ingredients.split('\n').map(item => item.trim()).filter(item => item !== ''),
        instructions: instructions,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
      });

      Alert.alert('Success', 'Recipe added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding recipe:', error);
      Alert.alert('Error', 'Failed to add recipe.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Ingredients (one per line)"
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Instructions"
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Recipe Photo</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe} disabled={uploading}>
        {uploading ? (
          <Text style={styles.buttonText}>Uploading...</Text>
        ) : (
          <Text style={styles.buttonText}>Add Recipe</Text>
        )}
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AddRecipeScreen;
