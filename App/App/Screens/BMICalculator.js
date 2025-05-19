import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h && w) {
      const bmiValue = w / (h * h);
      setBmi(bmiValue.toFixed(1));
      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue < 24.9) setCategory('Normal');
      else if (bmiValue < 29.9) setCategory('Overweight');
      else setCategory('Obesity');
    } else {
      setBmi(null);
      setCategory('');
    }
  };

  const getIndicatorPosition = (bmi) => {
    if (bmi <= 0) return '0%';
    if (bmi < 18.5) return `${(bmi / 18.5) * 25}%`; // 0–18.5 → 0–25%
    if (bmi < 25) return `${25 + ((bmi - 18.5) / (25 - 18.5)) * 25}%`; // 18.5–24.9 → 25–50%
    if (bmi < 30) return `${50 + ((bmi - 25) / (30 - 25)) * 25}%`; // 25–29.9 → 50–75%
    return `${75 + ((bmi - 30) / 10) * 25}%`; // 30–40+ → 75–100%
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>BMI Calculator</Text>

      <TextInput
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        style={styles.input}
      />

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
      />

      <LinearGradient
        colors={['#d4145a', '#9b1d33']}
        style={styles.gradientButton}
      >
        <TouchableOpacity onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>
      </LinearGradient>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your BMI: {bmi}</Text>
          <Text style={styles.resultCategory}>{category}</Text>

          <View style={styles.scaleContainer}>
            <View style={styles.scale}>
              <View style={[styles.scaleSegment, { backgroundColor: '#00c0ff' }]} />
              <View style={[styles.scaleSegment, { backgroundColor: '#3ddc84' }]} />
              <View style={[styles.scaleSegment, { backgroundColor: '#f9c80e' }]} />
              <View style={[styles.scaleSegment, { backgroundColor: '#f86624' }]} />
            </View>
            <View
              style={[
                styles.indicator,
                {
                  left: getIndicatorPosition(parseFloat(bmi)),
                },
              ]}
            />
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Under</Text>
              <Text style={styles.scaleLabel}>Normal</Text>
              <Text style={styles.scaleLabel}>Over</Text>
              <Text style={styles.scaleLabel}>Obese</Text>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default BMICalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginVertical: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  gradientButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonText: {
    textAlign: 'center',
    padding: 12,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultCategory: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  scaleContainer: {
    marginTop: 30,
    width: '100%',
  },
  scale: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  scaleSegment: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    top: -10,
    width: 2,
    height: 40,
    backgroundColor: '#000',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#333',
  },
});
