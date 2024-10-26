import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TextInputComponent from "../components/TextInputComponent";
import PasswordInputComponent from "../components/PasswordInputComponent";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import db from "../firebaseconfig";

type Props = NativeStackScreenProps<RootStackParamList, "DietitianLogin">;

const DietitianLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const dietitianRef = doc(db, "dietitians", userId);
      const dietitianDoc = await getDoc(dietitianRef);

      if (dietitianDoc.exists()) {
        
        Alert.alert("Success", "You are successfully logged in as a dietitian!");
        navigation.navigate("DietitianProfile");
      } else {
        
        Alert.alert("Error", "You are not authorized to login as a dietitian.");
      }
    } catch (error) {
      
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Login as a Dietitian</Text>
        <TextInputComponent
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordInputComponent
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DietitianLoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1F41BB",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
