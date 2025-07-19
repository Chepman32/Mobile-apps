
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const RecipeDetailScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const recipeData = { id: docSnap.id, ...docSnap.data() };
        setRecipe(recipeData);
        if (auth.currentUser) {
          setIsLiked(recipeData.likes && recipeData.likes.includes(auth.currentUser.uid));
        }
      } else {
        Alert.alert('Error', 'Recipe not found.');
      }
    };
    fetchRecipe();

    const q = query(collection(db, 'recipes', recipeId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(loadedComments);
    });
    return unsubscribe;
  }, [recipeId, auth.currentUser]);

  const handleLike = async () => {
    if (!auth.currentUser || !recipe) return;

    const recipeRef = doc(db, 'recipes', recipe.id);
    try {
      if (isLiked) {
        await updateDoc(recipeRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
        setIsLiked(false);
      } else {
        await updateDoc(recipeRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Error', 'Failed to update like.');
    }
  };

  const addComment = async () => {
    if (!newCommentText.trim() || !auth.currentUser || !recipe) return;

    try {
      await addDoc(collection(db, 'recipes', recipe.id, 'comments'), {
        text: newCommentText,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
      });
      setNewCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUser}>{item.userName}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
      <Text style={styles.commentTime}>{item.createdAt?.toDate().toLocaleString()}</Text>
    </View>
  );

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Loading recipe details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl && (
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
      )}
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.recipeAuthor}>By: {recipe.userName}</Text>

      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.likeButtonText}>{isLiked ? '❤️ Liked' : '🤍 Like'}</Text>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{recipe.likes ? recipe.likes.length : 0} Likes</Text>
      </View>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>• {ingredient}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructionsText}>{recipe.instructions}</Text>

      <Text style={styles.sectionTitle}>Comments:</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newCommentText}
          onChangeText={setNewCommentText}
        />
        <TouchableOpacity style={styles.commentButton} onPress={addComment}>
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  recipeAuthor: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  likeButtonText: {
    fontSize: 24,
    marginRight: 10,
  },
  likeCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  commentButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  commentTime: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default RecipeDetailScreen;
