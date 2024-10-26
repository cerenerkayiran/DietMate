import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserMenuBar: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuBar}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.menuItemText}>Homepage</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserTestResult')}>
        <Text style={styles.menuItemText}>TestResult</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Appointments')}>
        <Text style={styles.menuItemText}>Appointments</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserProfile')}>
        <Text style={styles.menuItemText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f7f7f7',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    padding: 5,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default UserMenuBar;