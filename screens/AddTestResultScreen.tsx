import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";


type Props = NativeStackScreenProps<RootStackParamList, "AddTestResult">;

const AddTestResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointment } = route.params;
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("");
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchUserName = async () => {
      const userRef = doc(db, "users", appointment.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserName(userDoc.data().fullName);
        setUserId(appointment.userId);
      }
    };

    fetchUserName();
  }, [appointment.userId, db]);

  const handleSave = async () => {
    try {
      const newTestResultRef = doc(collection(db, "testResults"));
      await setDoc(newTestResultRef, {
        testName,
        result,
        comment,
        user: userName,
        userId: userId,
      });

      const userRef = doc(db, "users", appointment.userId);
      await updateDoc(userRef, {
        testResultId: arrayUnion(newTestResultRef.id),
      });

      Alert.alert("Success", "Test result added successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding test result:", error);
      Alert.alert("Error", "Failed to add test result.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add Test Result for {userName}</Text>
      <TextInput
        value={testName}
        onChangeText={setTestName}
        placeholder="Test Name"
        style={styles.input}
      />
      <TextInput
        value={result}
        onChangeText={setResult}
        placeholder="Result"
        style={styles.input}
      />
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Comment"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Test Result</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1F41BB",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddTestResultScreen;
