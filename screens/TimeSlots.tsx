import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../firebaseconfig";

const TimeSlotsScreen = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [hours, setHours] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setHours([]);
  };

  const handleHourSelect = (hour: string) => {
    if (hours.includes(hour)) {
      setHours(hours.filter((h) => h !== hour));
    } else {
      setHours([...hours, hour]);
    }
  };

  const handleSave = async () => {
    if (!selectedDay || hours.length === 0) {
      Alert.alert("Error", "Please select a day and at least one hour.");
      return;
    }

    try {
      
      const timeSlotsQuery = query(
        collection(db, "timeSlots"),
        where("userId", "==", userId),
        where("day", "==", selectedDay)
      );
      const timeSlotsSnapshot = await getDocs(timeSlotsQuery);

      if (!timeSlotsSnapshot.empty) {
        
        const timeSlotDoc = timeSlotsSnapshot.docs[0];
        const existingHours = timeSlotDoc.data().hours || [];

       
        const newHours = hours.filter((hour) => !existingHours.includes(hour));

        if (newHours.length === 0) {
          Alert.alert("Error", "All selected time slots already exist.");
          return;
        }

        const updatedHours = [...new Set([...existingHours, ...newHours])]; 

        await updateDoc(timeSlotDoc.ref, { hours: updatedHours });
        Alert.alert("Success", "Time slots updated successfully");
      } else {
        
        await addDoc(collection(db, "timeSlots"), {
          userId,
          day: selectedDay,
          hours,
          timestamp: serverTimestamp(),
        });
        Alert.alert("Success", "Time slots saved successfully");
      }
    } catch (error) {
      console.error("Error saving time slots:", error);
      Alert.alert("Error", "Failed to save time slots");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Select a day:</Text>
          <Picker
            selectedValue={selectedDay}
            onValueChange={handleDaySelect}
            style={styles.picker}
          >
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
          </Picker>
          <Text style={styles.title}>Select hours:</Text>
          <View style={styles.hoursContainer}>
            {Array.from({ length: 9 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.hourButton,
                  hours.includes(`${i + 9}:00`) && styles.selectedHour,
                ]}
                onPress={() => handleHourSelect(`${i + 9}:00`)}
              >
                <Text style={styles.hourText}>{i + 9}:00</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  hourButton: {
    width: "30%",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedHour: {
    backgroundColor: "#1F41BB",
  },
  hourText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#1F41BB",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TimeSlotsScreen;
