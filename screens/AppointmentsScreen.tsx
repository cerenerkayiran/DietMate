import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../firebaseconfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import UserMenuBar from "../components/UserMenuBarComponent";

type Dietitian = {
  id: string;
  fullName: string;
  userType: string;
  
};

type Props = NativeStackScreenProps<RootStackParamList, "Appointments">;

const AppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [dietitians, setDietitians] = useState<Dietitian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        const dietitiansRef = collection(db, "dietitians");
        const dietitiansSnapshot = await getDocs(dietitiansRef);
        const dietitiansList = dietitiansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Dietitian, "id">),
        }));
        setDietitians(dietitiansList);
      } catch (error) {
        console.error("Error fetching dietitians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDietitians();
  }, []);

  const handleDietitianPress = (dietitian: Dietitian) => {
    if (userId) {
      navigation.navigate("DietitianDetails", {
        dietitianId: dietitian.id,
        userId,
      });
    } else {
      console.error("User not authenticated");
    }
  };

  const handleMyAppointmentsPress = () => {
    navigation.navigate("MyAppointments", { dietitianId: "", userId });
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleMyAppointmentsPress}
        style={{
          backgroundColor: "#1F41BB",
          padding: 10,
          borderRadius: 5,
          margin: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          My Appointments
        </Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      ) : dietitians.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No dietitians found.</Text>
      ) : (
        <FlatList
          data={dietitians}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDietitianPress(item)}>
              <View
                style={{
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {item.fullName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }} 
        />
      )}
      <UserMenuBar />
    </View>
  );
};

export default AppointmentsScreen;
