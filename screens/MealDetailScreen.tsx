import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import UserMenuBar from '../components/UserMenuBarComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'MealDetail'>;

const MealDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { meal } = route.params;
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleAddMeal = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentCalories = userDoc.data().initialCalories || 0;
          const calorieGoal = userDoc.data().calorieGoal || 0;
          const newCalories = currentCalories + meal.calorie;

          const updateUserData = async () => {
            await updateDoc(userRef, {
              initialCalories: newCalories,
              remainingCalories: Math.max(0, calorieGoal - newCalories),
            });

            Alert.alert('Success', 'Meal added successfully.');
            navigation.goBack();
          };

          if (newCalories >= calorieGoal) {
            Alert.alert(
              'Calorie Goal Achieved',
              'You have reached or exceeded your daily calorie goal!',
              [
                { text: 'OK', onPress: updateUserData }
              ],
              { cancelable: false }
            );
          } else {
            await updateUserData();
          }
        } else {
          Alert.alert('Error', 'User document not found');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'No authenticated user');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: meal.image }} style={styles.mealImage} />
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealInfo}>Calorie: {meal.calorie} kcal</Text>
      <Text style={styles.mealInfo}>Description: {meal.description}</Text>
      <Text style={styles.mealInfo}>Materials: {meal.materials}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
        <Text style={styles.addButtonText}>Add to My Meals</Text>
      </TouchableOpacity>
      <UserMenuBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  mealName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#1F41BB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealDetailScreen;
