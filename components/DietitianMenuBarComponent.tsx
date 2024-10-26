import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DietitianMenuBarComponent: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuBar}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("DietitianProfile")}>
        <Text style={styles.menuItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("DietitianAppointment")}>
        <Text style={styles.menuItemText}>Appointments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default DietitianMenuBarComponent;
