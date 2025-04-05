import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // To get userId
import { useNavigation } from "@react-navigation/native";
import Footer from "../common/Footer";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    try {
      // Fetch userId from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
      }

      const response = await fetch("http://10.1.17.148:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Only using userId instead of a token
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password reset successfully!");
        navigation.navigate("Login"); // Navigate to Login Page
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reset password. Try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <Footer navigation={navigation} />
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});