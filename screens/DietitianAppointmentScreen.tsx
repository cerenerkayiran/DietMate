import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { RootStackScreenProps } from "../types";
import DietitianMenuBarComponent from "../components/DietitianMenuBarComponent";

type Appointment = {
  id: string;
  userId: string;
  dietitianId: string;
  date: string;
  time: string;
};

type User = {
  fullName: string;
};

type Props = RootStackScreenProps<"DietitianAppointment">;

const DietitianAppointmentScreen: React.FC<Props> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchAppointments = async () => {
    try {
      if (user) {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("dietitianId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const appointmentsList: Appointment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsList.push({
            id: doc.id,
            userId: data.userId,
            dietitianId: data.dietitianId,
            date: data.day,
            time: data.hour,
          });
        });
        setAppointments(appointmentsList);
        fetchUserInfo(appointmentsList);
      }
    } catch (error) {
      Alert.alert("Error fetching appointments", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (appointments: Appointment[]) => {
    const userIds = Array.from(new Set(appointments.map((appointment) => appointment.userId)));
    const userInfo: { [key: string]: User } = {};

    for (const userId of userIds) {
      try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          userInfo[userId] = {
            fullName: userData.fullName,
          };
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    setUsers(userInfo);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("AppointmentDetail", { appointment: item })}
      style={styles.item}
    >
      <Text style={styles.title}>{users[item.userId]?.fullName || "N/A"}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : appointments.length === 0 ? (
        <Text>No appointments found.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <DietitianMenuBarComponent/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DietitianAppointmentScreen;