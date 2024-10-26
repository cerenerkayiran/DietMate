import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface Meal {
  id: string;
  name: string;
  calorie: number;
  description: string;
  type: string;
  materials: string;
  image: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "MealList">;

const MealListScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchMeals = async () => {
      const querySnapshot = await getDocs(collection(db, 'meals'));
      const mealsData: Meal[] = [];
      querySnapshot.forEach((doc) => {
        mealsData.push({ id: doc.id, ...doc.data() } as Meal);
      });
      setMeals(mealsData);
    };

    fetchMeals();
  }, []);

  const handleMealPress = (meal: Meal) => {
    navigate('MealDetail', { meal });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.mealItem} onPress={() => handleMealPress(item)}>
            <ImageBackground source={{ uri: item.image }} style={styles.mealImage}>
              <View style={styles.overlay}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealInfo}>{item.calorie} kcal</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  mealItem: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  mealName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealInfo: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MealListScreen;
