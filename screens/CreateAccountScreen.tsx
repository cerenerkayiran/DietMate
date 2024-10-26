import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TextInputComponent from "../components/TextInputComponent";
import PasswordInputComponent from "../components/PasswordInputComponent";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import db from "../firebaseconfig";
import DropdownComponent from "../components/DropDownComponent";
import RadioButtonComponent from "../components/RadioButtonComponent";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const genderOptions = ["Male", "Female", "Other"];

  const activityLevels = [
    { label: "Sedentary: little or no exercise", value: "sedentary" },
    { label: "Lightly active: light exercise/sports 1-3 days/week", value: "lightly_active" },
    { label: "Moderately active: moderate exercise/sports 3-5 days/week", value: "moderately_active" },
    { label: "Very active: hard exercise/sports 6-7 days a week", value: "very_active" },
  ];

  interface UserProfile {
    fullName: String;
    age: number;
    weight: number;
    height: number;
    gender: "Male" | "Female" | "Other";
    activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
    targetWeight: number;
  }

  type ActivityLevels = "sedentary" | "lightly_active" | "moderately_active" | "very_active";

  const activityFactors: Record<ActivityLevels, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  function calculateCalorieGoal(userProfile: UserProfile): number {
    const { age, weight, height, gender, activityLevel, targetWeight } = userProfile;
    let BMR: number;

    if (gender === "Male") {
      BMR = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender === "Female") {
      BMR = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    } else {
      BMR =
        (88.362 + 447.593) / 2 +
        ((13.397 + 9.247) / 2) * weight +
        ((4.799 + 3.098) / 2) * height -
        ((5.677 + 4.33) / 2) * age;
    }

    const maintenanceCalories = BMR * (activityFactors[activityLevel as ActivityLevels] || 1.2);

    if (weight > targetWeight) {
      return Math.round(maintenanceCalories - 500);
    } else if (weight < targetWeight) {
      return Math.round(maintenanceCalories + 500);
    }

    return Math.round(maintenanceCalories);
  }

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userProfile: UserProfile = {
        fullName,
        age: parseInt(age, 10),
        gender: gender as "Male" | "Female" | "Other",
        weight: parseInt(weight, 10),
        height: parseInt(height, 10),
        targetWeight: parseInt(targetWeight, 10),
        activityLevel: activityLevel as "sedentary" | "lightly_active" | "moderately_active" | "very_active",
      };

      const userId = userCredential.user.uid;
      const calorieGoal = calculateCalorieGoal(userProfile);
      const initialCalories = 0;
      const remainingCalories = Math.max(0, calorieGoal - initialCalories);

      if (initialCalories >= calorieGoal) {
        Alert.alert("Congratulations", "You have reached your calorie goal!");
      }

      await setDoc(doc(db, "users", userId), { ...userProfile, calorieGoal, initialCalories, remainingCalories });

      Alert.alert("Success", `User registered successfully. Daily calorie goal: ${calorieGoal} calories.`);
      navigate("Login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            padding: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: "#1F41BB",
                marginVertical: 30,
              }}
            >
              Create account
            </Text>
            <Text
              style={{
                fontSize: 14,
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              Create an account to have your dream body!
            </Text>
          </View>
          <View
            style={{
              marginVertical: 30,
            }}
          >
            <TextInputComponent placeholder="Email" value={email} onChangeText={setEmail} />

            <PasswordInputComponent placeholder="Password" value={password} onChangeText={setPassword} />

            <PasswordInputComponent
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TextInputComponent placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInputComponent
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad" 
            />
            <Text
              style={{
                fontSize: 20,
                color: "#1F41BB",
                marginVertical: 10,
              }}
            >
              Gender:
            </Text>
            <RadioButtonComponent options={genderOptions} selectedOption={gender} onSelect={setGender} />
            <TextInputComponent
              placeholder="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric" 
            />
            <TextInputComponent
              placeholder="Height (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric" 
            />
            <TextInputComponent
              placeholder="Target Weight"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric" 
            />

            <DropdownComponent
              items={activityLevels}
              selectedValue={activityLevel}
              onValueChange={setActivityLevel}
              placeholder="Select Activity Level"
            />
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            style={{
              padding: 20,
              backgroundColor: "#1F41BB",
              marginVertical: 30,
              borderRadius: 10,
              shadowColor: "#1F41BB",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 20,
              }}
            >
              Sign up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Login")}
            style={{
              padding: 10,
            }}
          >
            <Text
              style={{
                color: "#000",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              Already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
