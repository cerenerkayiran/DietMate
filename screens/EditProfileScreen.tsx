import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, updateDoc, getDoc } from "firebase/firestore";
import TextInputComponent from "../components/TextInputComponent";
import RadioButtonComponent from "../components/RadioButtonComponent";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  const genderOptions = ["Male", "Female", "Other"];

  const db = getFirestore();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "No authenticated user");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setAge(data.age?.toString() || "");
          setGender(data.gender || "");
          setWeight(data.weight?.toString() || "");
          setHeight(data.height?.toString() || "");
          setTargetWeight(data.targetWeight?.toString() || "");
        } else {
          Alert.alert("Error", "No user data found");
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An error occurred while fetching user data");
        }
      });
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "No authenticated user");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        fullName,
        age: Number(age),
        gender,
        weight: Number(weight),
        height: Number(height),
        targetWeight: Number(targetWeight),
      });
      Alert.alert("Success", "Profile updated successfully");
      navigation.navigate("UserProfile"); 
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text>Edit Your Profile</Text>
          <TextInputComponent
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInputComponent
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <Text
            style={{
              fontSize: 16,
              color: "#808081",
              marginVertical: 10 * 1,
              marginLeft: 20,
            }}
          >
            Gender
          </Text>
          <RadioButtonComponent
            options={genderOptions}
            selectedOption={gender}
            onSelect={setGender}
          />
          <TextInputComponent
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInputComponent
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <TextInputComponent
            placeholder="Target Weight"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={{
              padding: 10 * 2,
              backgroundColor: "#1F41BB",
              marginVertical: 10 * 3,
              borderRadius: 10,
              shadowColor: "#1F41BB",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
            onPress={handleSaveChanges}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 20,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
