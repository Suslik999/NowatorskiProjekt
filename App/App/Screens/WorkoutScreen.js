import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const defaultWorkouts = [
  {
    id: '1',
    title: 'Morning Boost',
    exercises: ['20 push-ups', '10 squats', '30 sec plank'],
    calories: 120,
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Full Body Blast',
    exercises: ['30 squats', '20 jumps', '1 min burpees'],
    calories: 250,
    difficulty: 'Medium',
  },
];

const WorkoutPlansScreen = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState(defaultWorkouts);
  const [completedCalories, setCompletedCalories] = useState(0);

  const loadData = async () => {
    try {
      const userWorkouts = await AsyncStorage.getItem('userWorkouts');
      const parsedWorkouts = userWorkouts ? JSON.parse(userWorkouts) : [];
      setWorkouts([...defaultWorkouts, ...parsedWorkouts]);

      const storedCalories = await AsyncStorage.getItem('completedCalories');
      setCompletedCalories(storedCalories ? parseInt(storedCalories, 10) : 0);
    } catch (e) {
      console.error('Error loading workouts or calories:', e);
    }
  };

  const clearCalories = async () => {
    await AsyncStorage.removeItem('completedCalories');
    setCompletedCalories(0);
  };

  const deleteWorkout = async (id) => {
    const newWorkouts = workouts.filter(w => w.id !== id || defaultWorkouts.find(d => d.id === id));
    const userOnly = newWorkouts.filter(w => !defaultWorkouts.find(d => d.id === w.id));
    await AsyncStorage.setItem('userWorkouts', JSON.stringify(userOnly));
    setWorkouts([...defaultWorkouts, ...userOnly]);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️ Workout Plans</Text>
      <Text style={styles.calories}>🔥 Calories Burned: {completedCalories} kcal</Text>

      <TouchableOpacity onPress={clearCalories} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>🧹 Clear Calories</Text>
      </TouchableOpacity>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => navigation.navigate('WorkoutDetails', { workout: item })}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.difficulty} • {item.calories} kcal</Text>
            </TouchableOpacity>

            {!defaultWorkouts.find(d => d.id === item.id) && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  Alert.alert('Delete Workout?', `Are you sure you want to delete "${item.title}"?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(item.id) },
                  ])
                }
              >
                <Text style={styles.deleteButtonText}>🗑 Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateWorkout')}>
        <LinearGradient
          colors={['#d4145a', '#9b1d33']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButtonGradient}
        >
          <Text style={styles.createButtonText}>➕ Create New Workout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f4f6fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  calories: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  clearButton: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fdd',
    padding: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#a00',
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignSelf: 'center',
    width: '90%',
  },
  saveButtonGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
