import React from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { height } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "DietitianHome">;

const DietitianHomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView>
      <View>
        <ImageBackground
          style={{
            height: height / 2.5,
          }}
          resizeMode="contain"
          source={require("../assets/dietitian-welcome.jpg")} 
        />
        <View
          style={{
            paddingHorizontal: 10 * 4,
            paddingTop: 10 * 4,
          }}
        >
          <Text
            style={{
              fontSize: 35,
              color: "#1F41BB",
              textAlign: "center",
            }}
          >
            Welcome to Dietitian Portal!
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#000",
              textAlign: "center",
              marginTop: 10 * 2,
            }}
          >
            Manage your dietitian account here.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10 * 2,
            paddingTop: 10 * 6,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("DietitianLogin")} 
            style={{
              backgroundColor: "#1F41BB",
              paddingVertical: 10 * 1.5,
              paddingHorizontal: 10 * 2,
              width: "48%",
              borderRadius: 10,
              shadowColor: "#1F41BB",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("DietitianRegister")} 
            style={{
              backgroundColor: "#1F41BB",
              paddingVertical: 10 * 1.5,
              paddingHorizontal: 10 * 2,
              width: "48%",
              borderRadius: 10,
              shadowColor: "#1F41BB",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DietitianHomeScreen;

const styles = StyleSheet.create({});
