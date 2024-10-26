import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import  TextInputComponent  from "../components/TextInputComponent";
import PasswordInputComponent from "../components/PasswordInputComponent";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        Alert.alert('Success', 'You are successfully logged in!');
        
        navigate("HomePage"); 
      })
      .catch((error) => {
        
        Alert.alert('Error', error.message);
      });
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10 * 2,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "#1F41BB",
              marginVertical: 10 * 3,
            }}
          >
            Login here
          </Text>
          <Text
            style={{
              fontSize: 20,
              maxWidth: "60%",
              textAlign: "center",
            }}
          >
            Welcome back to DietMate!
          </Text>
        </View>
        <View
          style={{
            marginVertical: 10 * 3,
          }}
        >
          <TextInputComponent  placeholder="Email"
          value={email}
          onChangeText={setEmail} />

          <PasswordInputComponent placeholder="Password"
          value={password}
          onChangeText={setPassword} />
        </View>

        <View>
          <TouchableOpacity
          onPress={() => navigate("ForgotPassword")}
          style={{
            padding: 10,
          }}>
            <Text
            style={{
              fontSize: 14,
              color: "#1F41BB",
              alignSelf: "flex-end",
            }}
          >
            Forgot your password ?
          </Text>
          </TouchableOpacity>
          
        </View>

        <TouchableOpacity
        onPress={handleSignIn}
          style={{
            padding: 10 * 2,
            backgroundColor: "#1F41BB",
            marginVertical: 10 * 3,
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
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Register")}
          style={{
            padding: 10,
          }}
        >
          <Text
            style={{
              color: "#000",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Create new account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});