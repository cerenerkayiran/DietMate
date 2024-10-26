import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import LoginScreen from "./screens/LoginScreen"; 
import { initializeApp, getApps } from "firebase/app";
import firebaseConfig from "./firebaseconfig";
import EditProfileScreen from "./screens/EditProfileScreen";
import DietitianHomeScreen from "./screens/DietitianHomeScreen";
import DietitianLoginScreen from "./screens/DietitianLogin";
import DietitianRegisterScreen from "./screens/DietitianRegister";
import DietitianEditProfileScreen from "./screens/DietitianEditProfileScreen";
import TimeSlotsScreen from "./screens/TimeSlots";
import DietitianProfileScreen from "./screens/DietitianProfile";
import LogoutScreen from "./screens/LogoutScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import HomePageScreen from "./screens/HomePage";
import MealListScreen from "./screens/MealListScreen";
import MealDetailScreen from "./screens/MealDetailScreen";
import TestResultListScreen from './screens/TestResultListScreen';
import TestResultDetailScreen from './screens/TestResultDetailScreen';
import UserTestResultScreen from './screens/UserTestResultScreen';
import UserTestResultDetailScreen from './screens/UserTestResultDetailScreen';
import AppointmentsScreen from "./screens/AppointmentsScreen";
import DietitianDetailsScreen from "./screens/DietitianDetailsScreen";
import MyAppointmentsScreen from "./screens/MyAppointments"
import DietitianAppointmentScreen from "./screens/DietitianAppointmentScreen";
import AppointmentDetailScreen from "./screens/DietitianAppointmentDetailScreen";
import AddTestResultScreen from "./screens/AddTestResultScreen";


const Stack = createNativeStackNavigator();

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
          name="Welcome"
          component={HomeScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
       <Stack.Screen
          name="Register"
          component={CreateAccountScreen}
          options={{ title: "Register" }}
        />
        <Stack.Screen name="TestResultList" component={TestResultListScreen} options={{title: "TestResultList"}}/>
        <Stack.Screen name="TestResultDetail" component={TestResultDetailScreen} options={{title: "TestResultDetail"}}/> 
        <Stack.Screen name="UserTestResult" component={UserTestResultScreen} options={{title: "UserTestResult"}}/>
        <Stack.Screen name="UserTestResultDetail" component={UserTestResultDetailScreen} options={{title: "UserTestResultDetail"}}/>
        <Stack.Screen name="DietitianAppointment"
         component={DietitianAppointmentScreen}
          options= {{title: "DietitianAppointment"}} />

          <Stack.Screen name= "AppointmentDetail"
          component={AppointmentDetailScreen}
          options={{title: "AppointmentDetail"}}/>

        <Stack.Screen
          name="Appointments"
          component={AppointmentsScreen}
          options={{ title: "Appointments" }}
        />

        <Stack.Screen
          name="MyAppointments"
          component={MyAppointmentsScreen}
          options={{ title: "My Appointments" }}
        />
        <Stack.Screen
          name="DietitianDetails"
          component={DietitianDetailsScreen}
          options={{ title: "Dietitian Details" }}
        />

        <Stack.Screen
          name="AddTestResult"
          component={AddTestResultScreen}
          options={{ title: "AddTestResult" }}
        />
        
        
        <Stack.Screen
          name="Logout"
          component={LogoutScreen}
          options={{ title: "Logout" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Profile" }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePageScreen}
          options={{ title: "Homepage" }}
        />
        
        <Stack.Screen
          name="DietitianHome"
          component={DietitianHomeScreen}
          options={{ title: "Dietitian Home" }}
        />
        <Stack.Screen
          name="DietitianLogin"
          component={DietitianLoginScreen}
          options={{ title: "Dietitian Login" }}
        />
        <Stack.Screen
          name="DietitianRegister"
          component={DietitianRegisterScreen}
          options={{ title: "Dietitian Register" }}
        />
        <Stack.Screen
          name="DietitianEditProfile"
          component={DietitianEditProfileScreen}
          options={{ title: "Edit Profile" }}
        />
        <Stack.Screen
          name="TimeSlots"
          component={TimeSlotsScreen}
          options={{ title: "Time Slots" }}
        />
        <Stack.Screen
          name="DietitianProfile"
          component={DietitianProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="MealList"
          component={MealListScreen}
          options={{ title: "Meal List" }}
        />
        <Stack.Screen
          name="MealDetail"
          component={MealDetailScreen}
          options={{ title: "Meal Detail" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;