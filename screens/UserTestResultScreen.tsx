import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type Props = NativeStackScreenProps<RootStackParamList, "UserTestResult">;

const UserTestResultScreen: React.FC<Props> = ({ navigation }) => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchTestResults = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const testResultIds = userDoc.data().testResultId;
          if (testResultIds && testResultIds.length > 0) {
            const testResultsList: any[] = [];
            for (const testResultId of testResultIds) {
              const testResultRef = doc(db, "testResults", testResultId);
              const testResultDoc = await getDoc(testResultRef);
              if (testResultDoc.exists()) {
                testResultsList.push({ id: testResultDoc.id, ...testResultDoc.data() });
              }
            }
            setTestResults(testResultsList);
          }
        }
      }
    };

    fetchTestResults();
  }, [auth.currentUser]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserTestResultDetail", { testResult: item })}
      style={styles.item}
    >
      <Text style={styles.title}>{item.testName}</Text>
      <Text>{item.user}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={testResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <UserMenuBar/>
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

export default UserTestResultScreen;
