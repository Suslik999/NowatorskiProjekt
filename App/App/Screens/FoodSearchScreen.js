import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const API_KEY = 'f103ebd67a3246e2b7d6f35a644719c7';

const FoodSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}&addRecipeNutrition=true&number=10`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFood = (item) => {
    if (!selectedFoods.find((f) => f.id === item.id)) {
      setSelectedFoods([...selectedFoods, item]);
    }
  };

  const getCalories = (item) => {
    const nutrient = item.nutrition?.nutrients?.find((n) => n.name === 'Calories');
    return nutrient ? Math.round(nutrient.amount) : 0;
  };

  const totalCalories = selectedFoods.reduce(
    (sum, item) => sum + getCalories(item),
    0
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍽️ Food Search</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter food name..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchFood}
      />

      <TouchableOpacity onPress={searchFood} style={{ marginHorizontal: 10, borderRadius: 8 }}>
        <LinearGradient
          colors={["#d4145a", "#9b1d33"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>🔍 Search</Text>
        </LinearGradient>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Loading...</Text>}

      <Text style={styles.sectionTitle}>Results:</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => addFood(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>
              Calories: {getCalories(item)} kcal
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>🧮 Calorie Calculator:</Text>
      {selectedFoods.map((item) => (
        <View key={item.id} style={styles.selectedItem}>
          <Text style={{ flex: 1 }}>{item.title}</Text>
          <Text>{getCalories(item)} kcal</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: {totalCalories} kcal</Text>
    </ScrollView>
  );
};

export default FoodSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    margin: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  loading: { textAlign: 'center', marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  card: {
    width: 150,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  cardTitle: { marginTop: 8, fontWeight: 'bold', textAlign: 'center' },
  cardSubtitle: { fontSize: 12, color: '#555' },
  selectedItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'right',
  },
});
