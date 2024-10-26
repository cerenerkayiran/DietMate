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

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView>
      <View>
        <ImageBackground
          style={{
            height: height / 2.5,
          }}
          resizeMode="contain"
          source={require("../assets/welcome-img.jpg")}
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
            Welcome to DietMate!
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#000",
              textAlign: "center",
              marginTop: 10 * 2,
            }}
          >
            Let us guide you to be the best version of yourself!
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10 * 2,
            paddingTop: 10 * 2,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("Login")}
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
            onPress={() => navigate("Register")}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 10 * 1.5,
              paddingHorizontal: 10 * 2,
              width: "48%",
              borderRadius: 10,
              shadowColor: "#fff",
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
                color: "#1F41BB",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 10 * 2,
            paddingTop: 10 * 2,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("DietitianHome")}
            style={{
              backgroundColor: "#FDC57B",
              paddingVertical: 10 * 1.5,
              paddingHorizontal: 10 * 2,
              width: "100%",
              borderRadius: 10,
              shadowColor: "#FDC57B",
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
              I am a Dietitian
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
