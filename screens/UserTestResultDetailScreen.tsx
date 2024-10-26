import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type Props = NativeStackScreenProps<RootStackParamList, "UserTestResultDetail">;

const UserTestResultDetailScreen: React.FC<Props> = ({ route }) => {
  const { testResult } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{testResult.testName}</Text>
      
      <View style={styles.section}>
        <Text style={styles.header}>Test Result:</Text>
        <Text style={styles.content}>{testResult.result}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.header}>Dietitian Comment:</Text>
        <Text style={styles.content}>{testResult.comment ? testResult.comment : "No comment available"}</Text>
      </View>
      <UserMenuBar/>
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
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
});

export default UserTestResultDetailScreen;
