import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Alert } from "react-native";
import { ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TextInputComponent from "../components/TextInputComponent";
import PasswordInputComponent from "../components/PasswordInputComponent";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import RadioButtonComponent from "../components/RadioButtonComponent";
import db from "../firebaseconfig";

type Props = NativeStackScreenProps<RootStackParamList, "DietitianRegister">;

const DietitianRegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const genderOptions = ["Male", "Female", "Other"];

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userProfile = {
        fullName,
        age,
        gender,
        address,
      };

      const userId = userCredential.user.uid;

      await setDoc(doc(db, "dietitians", userId), { userId, ...userProfile });

      Alert.alert("Success", "Dietitian registered successfully");
      navigation.navigate("DietitianLogin");
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
        <View style={{ padding: 10 * 2 }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 30, color: "#1F41BB", marginVertical: 10 * 3 }}
            >
              Create account
            </Text>
            <Text
              style={{ fontSize: 14, maxWidth: "80%", textAlign: "center" }}
            >
              Create an account as a dietitian to help people!
            </Text>
          </View>
          <View style={{ marginVertical: 10 * 3 }}>
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
            <TextInputComponent
              placeholder="Age"
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
            <PasswordInputComponent
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <PasswordInputComponent
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("DietitianLogin")}
              style={{ padding: 10 }}
            >
              <Text
                style={{ color: "#000", textAlign: "center", fontSize: 14 }}
              >
                Already have an account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={{
                padding: 10 * 2,
                backgroundColor: "#1F41BB",
                marginVertical: 10 * 3,
                borderRadius: 10,
                shadowColor: "#1F41BB",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }}
            >
              <Text
                style={{ color: "#fff", textAlign: "center", fontSize: 20 }}
              >
                Sign up as Dietitian
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DietitianRegisterScreen;

const styles = StyleSheet.create({});
