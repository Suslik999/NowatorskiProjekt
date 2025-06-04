import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

const CreateWorkoutScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [calories, setCalories] = useState('');
  const [exerciseText, setExerciseText] = useState('');
  const [exercises, setExercises] = useState([]);

  const addExercise = () => {
    if (exerciseText.trim() === '') return;
    setExercises([...exercises, exerciseText]);
    setExerciseText('');
  };

  const saveWorkout = async () => {
    if (!title || !difficulty || !calories || exercises.length === 0) {
      Alert.alert('Fill all fields and add at least one exercise');
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      title,
      difficulty,
      calories: parseInt(calories),
      exercises,
    };

    try {
      const existing = await AsyncStorage.getItem('userWorkouts');
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [...parsed, newWorkout];
      await AsyncStorage.setItem('userWorkouts', JSON.stringify(updated));
      Alert.alert('Workout saved!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Create Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Difficulty (Easy/Medium/Hard)"
        value={difficulty}
        onChangeText={setDifficulty}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add Exercise"
          value={exerciseText}
          onChangeText={setExerciseText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addExercise}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.exerciseItem}>• {item}</Text>}
        ListEmptyComponent={<Text style={styles.noExercises}>No exercises added</Text>}
      />

    <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
    <LinearGradient
        colors={["#d4145a", "#9b1d33"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.saveButtonGradient}
    >
        <Text style={styles.saveButtonText}>💾 Save Workout</Text>
    </LinearGradient>
    </TouchableOpacity>

    </View>
  );
};

export default CreateWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fc', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,  
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#d4145a', 
    padding: 12,
    borderRadius: 16,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  exerciseItem: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
  noExercises: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
