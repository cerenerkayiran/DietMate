import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getFirestore,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Calendar } from "react-native-calendars";
import DietitianMenuBarComponent from "../components/DietitianMenuBarComponent";

type Props = NativeStackScreenProps<RootStackParamList, "DietitianProfile">;

const DietitianProfile: React.FC<Props> = ({ navigation }) => {
  const [dietitian, setDietitian] = useState<any>({});
  const [timeSlots, setTimeSlots] = useState<
    { day: string; hours: string[] }[]
  >([]);
  const [user, setUser] = useState<any>(null);

  const db = getFirestore();
  const auth = getAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchDietitianData(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchDietitianData = async (userId: string) => {
    try {
      const dietitianDoc = await getDoc(doc(db, "dietitians", userId));
      if (dietitianDoc.exists()) {
        const dietitianData = dietitianDoc.data();
        setDietitian(dietitianData);
        fetchTimeSlots(userId);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching dietitian data:", error);
    }
  };

  const fetchTimeSlots = async (userId: string) => {
    try {
      const timeSlotsQuery = query(
        collection(db, "timeSlots"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(timeSlotsQuery);
      const slots: { day: string; hours: string[] }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.hours) {
          slots.push({ day: data.day, hours: data.hours });
        }
      });

      
      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      
      const sortedTimeSlots = slots.sort((a, b) => {
        const dayIndexA = daysOfWeek.indexOf(a.day);
        const dayIndexB = daysOfWeek.indexOf(b.day);
        return dayIndexA - dayIndexB;
      });

      setTimeSlots(sortedTimeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate("DietitianEditProfile");
  };

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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Logout");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <Text style={styles.name}>{dietitian.fullName || "No Name"}</Text>
            <Text style={styles.address}>
              {dietitian.address || "No Address"}
            </Text>
            {renderCalendar()}
          </View>
          <View style={styles.timeSlotsSection}>
            <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
            {timeSlots.length > 0 ? (
              timeSlots.map((timeSlot, index) => (
                <View key={index}>
                  <Text style={styles.day}>{timeSlot.day}:</Text>
                  {timeSlot.hours.map((hour, idx) => (
                    <Text key={idx} style={styles.timeSlot}>
                      {hour}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.timeSlot}>No time slots available</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DietitianMenuBarComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 100, 
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  calendar: {
    marginTop: 10,
    marginBottom: 10,
  },
  address: {
    fontSize: 18,
    textAlign: "center",
  },
  timeSlotsSection: {
    marginBottom: 20,
  },
  timeSlotsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  timeSlot: {
    fontSize: 16,
    marginLeft: 10,
  },
  editProfileButton: {
    backgroundColor: "#2E5EBA",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  editProfileButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#e46161",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 50, 
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default DietitianProfile;
