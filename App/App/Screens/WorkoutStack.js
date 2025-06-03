import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutPlansScreen from './WorkoutScreen';
import WorkoutDetailsScreen from './WorkoutDetailsScreen';
import CreateWorkoutScreen from './CreateWorkoutScreen';

const Stack = createNativeStackNavigator();

const WorkoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{ title: 'Workout Plans' }}
      />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetailsScreen}
        options={{ title: 'Workout Details' }}
      />
      <Stack.Screen
        name="CreateWorkout"
        component={CreateWorkoutScreen}
        options={{ title: 'Create Workout' }}
      />
    </Stack.Navigator>
  );
};

export default WorkoutStack;
