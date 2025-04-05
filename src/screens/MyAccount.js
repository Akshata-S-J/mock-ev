import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Footer from "../common/Footer";
import userimg from '../../assets/userIcon.png'; // Ensure correct path

const MyAccount = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        `http://10.1.17.148:5000/api/auth/user/${userId}`,
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
      ) : user ? (
        
        <View style={styles.profileContainer}>
             
          {/* User Image */}
          <Image
            source={userimg}
            style={styles.userImage}
          />
          {/* Username */}
          <Text style={styles.username}>{user.username}</Text>

          {/* Account Details */}
          <View style={styles.accountBox}>
          <Text style={styles.title}>Account Details</Text>
            <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {user.email}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Phone:</Text> {user.contactNumber}</Text>
            <Text style={styles.detail}><Text style={styles.label}>Created On:</Text> {new Date(user.createdAt).toDateString()}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Error: No user data available.</Text>
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
  profileContainer: {
    alignItems: "center",
    width: "100%",
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  accountBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
    alignItems: "center",
    top:100,
    height:"40%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  detail: {
    fontSize: 20,
    color: "#444",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyAccount;
