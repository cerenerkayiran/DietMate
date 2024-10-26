import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Calendar } from "react-native-calendars";
import UserMenuBar from "../components/UserMenuBarComponent";

type Props = NativeStackScreenProps<RootStackParamList, "HomePage">;

const HomePageScreen: React.FC<Props> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
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

  const renderCalendar = () => {
    const markedDates = {};
    markedDates[selectedDate.toISOString().slice(0, 10)] = {
      selected: true,
      selectedColor: "#1F41BB",
    };

    return (
      <Calendar
        style={styles.calendar}
        onDayPress={(day) => setSelectedDate(new Date(day.dateString))}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#f9f9f9",
          textSectionTitleColor: "#1F41BB",
          selectedDayBackgroundColor: "#1F41BB",
          selectedDayTextColor: "#fff",
          todayTextColor: "#1F41BB",
          dayTextColor: "#333",
          arrowColor: "#1F41BB",
        }}
      />
    );
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.welcomeText}>Welcome {userData.fullName}!</Text>
        {renderCalendar()}
        <Text style={styles.calorieIntake}>Calorie Intake</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
        </View>
        <TouchableOpacity
          style={styles.addMealsButton}
          onPress={() => navigation.navigate("MealList")}
        >
          <Text style={styles.addMealsButtonText}>Add Meals</Text>
        </TouchableOpacity>
      </ScrollView>
      <UserMenuBar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100, 
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F41BB",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  calorieIntake: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9ba6a5",
    textAlign: "left",
    marginTop: 32,
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 20,
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
  addMealsButton: {
    backgroundColor: "#1F41BB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addMealsButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default HomePageScreen;
