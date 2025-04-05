import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Footer from "../common/Footer";
import Account from "../screens/MyAccount"; // If it's inside the screens folder
import ResetPassword from "./ResetPassword";
import home from "./Home";
const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatusBar.setHidden(true);
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`;
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Error", "Unauthorized! Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(
        `http://10.1.17.148:5001/api/auth/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user && user.username ? (
        <>
          <View style={styles.profileHeader}>
            <Image
              source={require("../../assets/userIcon.png")}
              style={styles.profilePic}
            />
            <Text style={styles.profileName}>{user.username}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            
          </View>

          <View style={styles.menuContainer}>
  <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("Account")}>
    <Text style={styles.optionText}>👤 Account</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("YourBooking")}>
    <Text style={styles.optionText}>📅 Your Booking</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("PrivacyPolicy")}>
    <Text style={styles.optionText}>🔒 Privacy Policy</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("TermsConditions")}>
    <Text style={styles.optionText}>📜 Terms & Conditions</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate("ResetPassword")}>
    <Text style={styles.optionText}>🔑 Reset Password</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.optionBox, styles.logoutButton]} onPress={() => navigation.navigate("home")}>
    <Text style={[styles.optionText, { color: "red" }]}>🚪 Logout</Text>
  </TouchableOpacity>
</View>

        </>
      ) : (
        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Error: No user data received.
        </Text>
      )}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 100,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    top: -90,
  },
  profileEmail: {
    fontSize: 19,
    color: "#666",
    top: -80,
  },
  profilePhone: {
    fontSize: 19,
    color: "#666",
    top: -70,
  },
  menuContainer: {
    width: "90%",
    alignItems: "center",
  },
  optionBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "150%",
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
    top: -60,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ffe6e6",
  },
});

export default Profile;