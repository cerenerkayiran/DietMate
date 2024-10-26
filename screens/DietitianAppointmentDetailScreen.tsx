import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RootStackScreenProps } from "../types";

type Props = RootStackScreenProps<"AppointmentDetail">;

const AppointmentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointment } = route.params;

  const handleAddTestResult = () => {
    navigation.navigate("AddTestResult", { appointment });
  };

  const handleTestResultList = () => {
    navigation.navigate("TestResultList", { userId: appointment.userId });
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Appointment Day:</Text>
      <Text style={styles.value}>{appointment.date} {appointment.time}</Text>
      <Text style={styles.label}>Appointment Time:</Text>
      <Text style={styles.value}>{appointment.time}</Text>
      <TouchableOpacity onPress={handleAddTestResult} style={styles.button}>
        <Text style={styles.buttonText}>Add Test Result</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTestResultList} style={styles.button}>
        <Text style={styles.buttonText}>Test Result List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#1F41BB",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AppointmentDetailScreen;
