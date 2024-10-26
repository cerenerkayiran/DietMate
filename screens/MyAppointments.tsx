import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import db from "../firebaseconfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type Appointment = {
  dietitianId: string;
  appointmentDay: string;
  appointmentTime: string;
};

type Dietitian = {
  fullName: string;
  address: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "MyAppointments">;

const MyAppointments: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dietitians, setDietitians] = useState<{ [key: string]: Dietitian }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const appointmentsQuery = query(
        appointmentsRef,
        where("userId", "==", userId)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsList: Appointment[] = [];
      appointmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          dietitianId: data.dietitianId,
          appointmentDay: data.day,
          appointmentTime: data.hour,
        });
      });
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietitianInfo = async (appointments: Appointment[]) => {
    const dietitianIds = Array.from(
      new Set(appointments.map((appointment) => appointment.dietitianId))
    );
    const dietitianInfo: { [key: string]: Dietitian } = {};

    for (const dietitianId of dietitianIds) {
      try {
        const dietitianRef = doc(db, "dietitians", dietitianId);
        const dietitianSnapshot = await getDoc(dietitianRef);

        if (dietitianSnapshot.exists()) {
          const dietitianData = dietitianSnapshot.data();
          dietitianInfo[dietitianId] = {
            fullName: dietitianData.fullName,
            address: dietitianData.address,
          };
        }
      } catch (error) {
        console.error("Error fetching dietitian info:", error);
      }
    }

    setDietitians(dietitianInfo);
  };

  useEffect(() => {
    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  useEffect(() => {
    if (appointments.length > 0) {
      fetchDietitianInfo(appointments);
    }
  }, [appointments]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : appointments.length === 0 ? (
        <Text>No appointments found.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Dietitian: {dietitians[item.dietitianId]?.fullName || "N/A"}
              </Text>
              <Text>
                Address: {dietitians[item.dietitianId]?.address || "N/A"}
              </Text>
              <Text>Appointment Day: {item.appointmentDay}</Text>
              <Text>Appointment Time: {item.appointmentTime}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <UserMenuBar/>
    </View>
  );
};

export default MyAppointments;
