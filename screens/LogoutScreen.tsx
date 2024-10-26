import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Logout">;

const LogoutScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      
      navigation.navigate("Welcome");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.message}>You have been logged out.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2E5EBA",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LogoutScreen;