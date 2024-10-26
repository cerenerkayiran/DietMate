import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import db from "../firebaseconfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type TimeSlot = {
  id: string;
  day: string;
  hours: string[];
};

type Dietitian = {
  name: string;
  address: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "DietitianDetails">;

const DietitianDetailsScreen: React.FC<Props> = ({ route }) => {
  const { dietitianId, userId } = route.params;
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [dietitianInfo, setDietitianInfo] = useState<Dietitian | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("");

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const timeSlotsQuery = query(
          collection(db, "timeSlots"),
          where("userId", "==", dietitianId)
        );
        const querySnapshot = await getDocs(timeSlotsQuery);
        const slots: TimeSlot[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.hours) {
            slots.push({ id: doc.id, day: data.day, hours: data.hours });
          }
        });
        slots.sort((a, b) => {
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return days.indexOf(a.day) - days.indexOf(b.day);
        });
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    const fetchDietitianInfo = async () => {
      try {
        const dietitianQuery = query(
          collection(db, "dietitians"),
          where("userId", "==", dietitianId)
        );
        const dietitianSnapshot = await getDocs(dietitianQuery);
        if (!dietitianSnapshot.empty) {
          const dietitianData = dietitianSnapshot.docs[0].data();
          setDietitianInfo({
            name: dietitianData.fullName,
            address: dietitianData.address,
          });
        }
      } catch (error) {
        console.error("Error fetching dietitian info:", error);
      }
    };

    fetchTimeSlots();
    fetchDietitianInfo();
  }, [dietitianId]);

  const handleMakeAppointment = async () => {
    if (!selectedDay || !selectedHour) {
      Alert.alert("Error", "Please select a day and an hour.");
      return;
    }

    try {
      const timeSlotToDelete = timeSlots.find(
        (slot) => slot.day === selectedDay && slot.hours.includes(selectedHour)
      );

      if (!timeSlotToDelete) {
        Alert.alert("Error", "Selected time slot not found.");
        return;
      }

      const updatedHours = timeSlotToDelete.hours.filter(
        (hour) => hour !== selectedHour
      );
      await updateDoc(doc(db, "timeSlots", timeSlotToDelete.id), {
        hours: updatedHours,
      });

      await addDoc(collection(db, "appointments"), {
        userId,
        dietitianId,
        day: selectedDay,
        hour: selectedHour,
      });

      const updatedTimeSlots = timeSlots.map((slot) =>
        slot.id === timeSlotToDelete.id
          ? { ...slot, hours: updatedHours }
          : slot
      );

      setTimeSlots(updatedTimeSlots);

      Alert.alert("Success", "Appointment made successfully!");
      setSelectedDay("");
      setSelectedHour("");
    } catch (error) {
      console.error("Error making appointment:", error);
      Alert.alert("Error", "Failed to make appointment.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          dietitianInfo ? (
            <>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                {dietitianInfo.name}
              </Text>
              <Text>{dietitianInfo.address}</Text>
            </>
          ) : null
        }
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={timeSlots}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.day}
            </Text>
            <FlatList
              data={item.hours}
              renderItem={({ item: hour }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      selectedDay === item.day && selectedHour === hour
                        ? "#1F41BB"
                        : "#f2f2f2",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  onPress={() => {
                    setSelectedDay(item.day);
                    setSelectedHour(hour);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedDay === item.day && selectedHour === hour
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(hour) => hour}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.makeAppointmentButton}
            onPress={handleMakeAppointment}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Make Appointment
            </Text>
          </TouchableOpacity>
        }
      />
      <UserMenuBar />
    </View>
  );
};

const styles = StyleSheet.create({
  makeAppointmentButton: {
    backgroundColor: "#1F41BB",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
});

export default DietitianDetailsScreen;
