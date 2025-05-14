import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { API_KEY_FOOD } from '@env';

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
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY_FOOD}&addRecipeNutrition=true&number=10`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCaloriesPer100g = (item) => {
    const nutrient = item.nutrition?.nutrients?.find((n) => n.name === 'Calories');
    return nutrient ? nutrient.amount : 0;
  };

  const addFood = (item) => {
    if (!selectedFoods.find((f) => f.id === item.id)) {
      setSelectedFoods([
        ...selectedFoods,
        {
          ...item,
          grams: 100,
          tempGramsText: '100',
        },
      ]);
    }
  };

  const updateTempText = (id, text) => {
    setSelectedFoods((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, tempGramsText: text } : item
      )
    );
  };

  const commitGramsChange = (id) => {
    setSelectedFoods((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              grams: parseFloat(item.tempGramsText) || 0,
            }
          : item
      )
    );
    Keyboard.dismiss();
  };

  const getCalories = (item) => {
    const per100g = getCaloriesPer100g(item);
    return Math.round((item.grams / 100) * per100g);
  };

  const removeFood = (id) => {
    setSelectedFoods((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setSelectedFoods([]);
  };

  const totalCalories = selectedFoods.reduce(
    (sum, item) => sum + getCalories(item),
    0
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
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
                {Math.round(getCaloriesPer100g(item))} kcal / 100g
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.sectionTitle}>🧮 Calorie Calculator:</Text>
        <FlatList
          data={selectedFoods}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.selectedItem}>
              <Text style={{ flex: 1 }}>{item.title}</Text>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={item.tempGramsText}
                onChangeText={(text) => updateTempText(item.id, text)}
                onEndEditing={() => commitGramsChange(item.id)}
              />
              <Text>{getCalories(item)} kcal</Text>
              <TouchableOpacity onPress={() => removeFood(item.id)}>
                <Text style={styles.removeText}>✖</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.fixedFooter}>
          {selectedFoods.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>🧹 Clear All</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.total}>Total: {totalCalories} kcal</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
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
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  quantityInput: {
    width: 60,
    height: 35,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 6,
    marginRight: 8,
    textAlign: 'center',
  },
  removeText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#900',
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  clearButtonText: {
    color: '#d4145a',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
