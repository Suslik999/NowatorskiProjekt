import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTodayDateKey = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export default function StepCounterScreen() {
    const [steps, setSteps] = useState(0);
    const lastStepTimeRef = useRef(0);
    const lastAccelRef = useRef(0);
    const stepCountRef = useRef(0);
    const subscription = useRef(null);

    const STEP_THRESHOLD = 1.1;
    const STEP_DELAY_MS = 400;

    const saveSteps = async (count) => {
        try {
            await AsyncStorage.setItem('@steps_today', count.toString());
            await AsyncStorage.setItem('@last_date', getTodayDateKey());
        } catch {}
    };

    const loadSteps = async () => {
        try {
            const savedDate = await AsyncStorage.getItem('@last_date');
            const savedSteps = await AsyncStorage.getItem('@steps_today');
            const todayKey = getTodayDateKey();
            if (savedDate === todayKey && savedSteps !== null) {
                const parsed = parseInt(savedSteps, 10);
                setSteps(parsed);
                stepCountRef.current = parsed;
            } else {
                setSteps(0);
                stepCountRef.current = 0;
            }
        } catch {
            setSteps(0);
            stepCountRef.current = 0;
        }
    };

    const handleAccelerometerData = ({ x, y, z }) => {
        const totalAccel = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (
            totalAccel > STEP_THRESHOLD &&
            now - lastStepTimeRef.current > STEP_DELAY_MS &&
            totalAccel > lastAccelRef.current
        ) {
            stepCountRef.current += 1;
            setSteps(stepCountRef.current);
            lastStepTimeRef.current = now;
            saveSteps(stepCountRef.current);
        }
        lastAccelRef.current = totalAccel;
    };

    useEffect(() => {
        loadSteps();
        subscription.current = Accelerometer.addListener(handleAccelerometerData);
        Accelerometer.setUpdateInterval(200);

        return () => {
            subscription.current && subscription.current.remove();
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Step Counter</Text>
            <Text style={styles.steps}>{steps}</Text>
            <Text style={styles.date}>Date: {getTodayDateKey()}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 20,
        color: '#222',
        textAlign: 'center',
    },
    steps: {
        fontSize: 64,
        fontWeight: '900',
        color: '#d4145a',
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
});
