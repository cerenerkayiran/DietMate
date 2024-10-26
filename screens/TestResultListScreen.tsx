import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TestResultList">;

const TestResultList: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [testResults, setTestResults] = useState<any[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const q = query(collection(db, "testResults"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTestResults(results);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, [userId]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("TestResultDetail", { testResult: item })}
      style={styles.item}
    >
      <Text style={styles.title}>{item.testName}</Text>
      <Text>{item.result}</Text>
      <Text>{item.comment || "No comment available"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={testResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TestResultList;
