import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TestResultDetail">;

const TestResultDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { testResult } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [result, setResult] = useState(testResult.result);
  const [comment, setComment] = useState(testResult.comment);
  const db = getFirestore();

  const handleSave = async () => {
    try {
      const testResultRef = doc(db, "testResults", testResult.id);
      await updateDoc(testResultRef, { result, comment });
      Alert.alert("Success", "Test result and comment updated successfully.");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update test result and comment.");
      console.error("Error updating test result and comment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{testResult.testName}</Text>
      
      <Text style={styles.label}>Test Result:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={result}
          onChangeText={setResult}
        />
      ) : (
        <Text>{result}</Text>
      )}
      
      <Text style={styles.label}>Dietitian Comment:</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
        />
      ) : (
        <Text>{comment}</Text>
      )}
      
      {isEditing ? (
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
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

export default TestResultDetailScreen;
