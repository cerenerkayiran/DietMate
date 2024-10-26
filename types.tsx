import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Meal = {
  id: string;
  name: string;
  calorie: number;
  description: string;
  type: string;
  materials: string;
  image: string;
};

type TestResult = {
  id: string;
  user: string;
  testName: string;
  result: string;
  comment?: string;
};

type Appointment = {
  id: string;
  userId: string;
  dietitianId: string;
  date: string;
  time: string;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EditProfile: undefined;
  DietitianHome: undefined;
  DietitianLogin: undefined;
  DietitianRegister: undefined;
  DietitianEditProfile: undefined;
  TimeSlots: undefined;
  DietitianProfile: undefined;
  Logout: undefined;
  UserProfile: undefined;
  HomePage: undefined;
  DietitianDetails: {dietitianId:string; userId:string};
  MyAppointments: {dietitianId: string; userId:string};
  MealList: undefined;
  MealDetail: { meal: Meal };
  TestResultList: undefined;
  TestResultDetail: { testResult: TestResult };
  UserTestResult: undefined;
  UserTestResultDetail: { testResult: TestResult };
  DietitianAppointment: undefined; 
  AppointmentDetail: { appointment: Appointment }; 
  Appointments: undefined;
  AddTestResult: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
