import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutDetailsScreen = ({ route, navigation }) => {
  const { workout } = route.params;

  const handleCompleteWorkout = async () => {
    try {
      const stored = await AsyncStorage.getItem('completedCalories');
      const currentCalories = stored ? parseInt(stored, 10) : 0;
      const updatedCalories = currentCalories + workout.calories;

      await AsyncStorage.setItem('completedCalories', updatedCalories.toString());

      Alert.alert('✅ Workout Completed', `You burned ${workout.calories} kcal!`);
      navigation.goBack();
    } catch (e) {
      console.error('Error saving calories:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.subtitle}>🔥 {workout.calories} kcal • {workout.difficulty}</Text>

      <Text style={styles.sectionTitle}>📝 Exercises:</Text>
      <FlatList
        data={workout.exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
      />

      <TouchableOpacity style={{ marginTop: 30 }} onPress={handleCompleteWorkout}>
        <LinearGradient
          colors={['#0f9d58', '#34a853']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>✅ Complete</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    paddingVertical: 4,
    color: '#333',
  },
  gradientButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
