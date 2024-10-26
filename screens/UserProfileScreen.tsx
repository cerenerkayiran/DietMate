import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type Props = NativeStackScreenProps<RootStackParamList, "UserProfile">;

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "No authenticated user");
      return;
    }

    const fetchUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        const progressValue = Math.min(data.initialCalories / data.calorieGoal, 1);
        setProgress(progressValue);
      } else {
        Alert.alert("Error", "User data not found");
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Logout");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "An error occurred while logging out");
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Daily Progress</Text>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
      </View>
      <Text style={styles.profileDetailsHeader}>Profile Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Full Name: <Text style={styles.infoValue}>{userData.fullName}</Text>
        </Text>
        <Text style={styles.infoText}>
          Age: <Text style={styles.infoValue}>{userData.age}</Text>
        </Text>
        <Text style={styles.infoText}>
          Gender: <Text style={styles.infoValue}>{userData.gender}</Text>
        </Text>
        <Text style={styles.infoText}>
          Weight: <Text style={styles.infoValue}>{userData.weight} kg</Text>
        </Text>
        <Text style={styles.infoText}>
          Height: <Text style={styles.infoValue}>{userData.height} cm</Text>
        </Text>
        <Text style={styles.infoText}>
          Target Weight:{" "}
          <Text style={styles.infoValue}>{userData.targetWeight} kg</Text>
        </Text>
        <Text style={styles.infoText}>
          Activity Level:{" "}
          <Text style={styles.infoValue}>{userData.activityLevel}</Text>
        </Text>
        <Text style={styles.infoText}>
          Daily Calorie Goal:{" "}
          <Text style={styles.infoValue}>{userData.calorieGoal} calories</Text>
        </Text>
        <Text style={styles.infoText}>
          Calories Taken:{" "}
          <Text style={styles.infoValue}>{userData.initialCalories} calories</Text>
        </Text>
        <Text style={styles.infoText}>
          Remaining Calories:{" "}
          <Text style={styles.infoValue}>
            {Math.max(0, userData.calorieGoal - userData.initialCalories)} calories
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
     <UserMenuBar/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F41BB",
    textAlign: "center",
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  progressBar: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#1F41BB",
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    color: "#1F41BB",
  },
  profileDetailsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F41BB",
    marginBottom: 16,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  infoValue: {
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#1F41BB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#e46161",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
  },
  menuBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  menuItem: {
    padding: 5,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default UserProfileScreen;
