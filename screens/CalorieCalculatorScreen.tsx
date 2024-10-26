import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, updateDoc, getDoc, DocumentData } from 'firebase/firestore';

interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: 'low' | 'normal' | 'high';
  goal: 'lose' | 'gain';
  targetWeight: number;
}

const CalorieCalculatorScreen = () => {
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef).then(docSnap => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserData;
            const calorieGoal = calculateCalories(userData);
            updateCalorieGoal(user.uid, calorieGoal);
          } else {
            Alert.alert('Error', 'No user data found.');
          }
        }).catch(error => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          Alert.alert('Error', errorMessage);
        });
      } else {
        Alert.alert('Error', 'No authenticated user.');
      }
    });

    return unsubscribe; 
  }, []);

  const calculateCalories = (data: UserData): number => {
    const { age, weight, height, gender, activityLevel, goal } = data;
    let BMR = gender === 'male' ? 
      10 * weight + 6.25 * height - 5 * age + 5 :
      10 * weight + 6.25 * height - 5 * age - 161;

    const activityFactors = {
      low: 1.2,
      normal: 1.55,
      high: 1.725,
    };

    let maintenanceCalories = BMR * (activityFactors[activityLevel] || 1.55);

    if (goal === 'lose') {
      maintenanceCalories -= 500;
    } else if (goal === 'gain') {
      maintenanceCalories += 500;
    }

    return maintenanceCalories;
  };

  const updateCalorieGoal = (userId: string, calorieGoal: number) => {
    const userRef = doc(db, 'users', userId);
    updateDoc(userRef, { calorieGoal })
      .then(() => Alert.alert('Success', `Calorie goal updated to ${calorieGoal}`))
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <View>
      <Text>Calculating...</Text>
    </View>
  );
};

export default CalorieCalculatorScreen;
