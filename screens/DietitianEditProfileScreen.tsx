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

type Props = NativeStackScreenProps<RootStackParamList, "DietitianRegister">;

const DietitianEditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [timeSlot, setTimeSlots] = useState("");

  const db = getFirestore();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "No authenticated user");
      return;
    }
    const userRef = doc(db, "dietitians", user.uid);
    getDoc(userRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFullName(data.fullName || "");
          setAddress(data.address || "");
          setEmail(data.email || "");
          setGender(data.gender || "");
          setTimeSlots(data.timeSlot || "");
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

  const handleAddTimeSlots = () => {
    navigation.navigate("TimeSlots");
  };

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "No authenticated user");
      return;
    }
    const userRef = doc(db, "dietitians", user.uid);
    try {
      await updateDoc(userRef, {
        fullName,
        email,
        address,
        gender,
        timeSlot,
      });
      Alert.alert("Success", "Profile updated successfully");
      navigation.navigate("DietitianProfile"); 
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInputComponent
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <Text>Gender:</Text>
          <RadioButtonComponent
            options={genderOptions}
            selectedOption={gender}
            onSelect={setGender}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddTimeSlots}>
            <Text style={styles.buttonText}>Add Time Slots</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
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
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
});

export default DietitianEditProfileScreen;