import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSendPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Success", "Password reset email sent!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendPassword}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 30,
    color: "#1F41BB",
  },
  formContainer: {
    marginVertical: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1F41BB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#1F41BB",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
