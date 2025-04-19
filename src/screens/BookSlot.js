import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TimeSelector from '../common/TimeSelector.js'; // adjust path if needed

const BookSlot = ({ route }) => {
  const { stationId } = route.params;
  const navigation = useNavigation();

  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("10:30 AM");
  const [chargingPoints, setChargingPoints] = useState([]);
  const [pointNumber, setPointNumber] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2MxNDRiYWY1YzI5ZjUyMTcyZGY3NiIsImlhdCI6MTc0MjQ0NjUzOCwiZXhwIjoxNzczOTgyNTM4fQ.MFrsevI_POX8uAny7BWhvA_W5hRVFW51W6FPyp7R_XY`; // Use your actual token
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!token || !storedUserId) {
        Alert.alert("Error", "Unauthorized! Please login again.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(
        `http://10.1.17.148:5000/api/auth/user/${storedUserId}`,
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
        setUserId(data._id);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChargingPoints = async () => {
    try {
      const res = await axios.get(`http://10.1.17.148:5000/api/stations/${stationId}`);
      const points = res.data.chargingPoints || [];
  
      setChargingPoints(points);
  
      if (points.length > 0) {
        setPointNumber(points[0].pointNumber);
        setBookedSlots(points[0].slots || []);
      }
    } catch (error) {
      console.error("Error fetching charging points:", error);
    }
  };

  const onPointChange = (value) => {
    const num = parseInt(value); // 🔧 Force number
    setPointNumber(num);
  
    const selectedPoint = chargingPoints.find(p => p.pointNumber === num);
    setBookedSlots(selectedPoint?.slots || []);
  };

  const bookSlot = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    try {
      const res = await axios.post(`http://10.1.17.148:5000/api/stations/${stationId}/book`, {
        pointNumber: parseInt(pointNumber),
        startTime,
        endTime,
        userId
      });
      Alert.alert("Success", res.data.message);
      
      // Refetch all slots after booking
      fetchChargingPoints();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  const formatTimeSlot = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startTime = `${startDate.getHours() % 12 || 12}:${startDate.getMinutes().toString().padStart(2, '0')} ${startDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    const endTime = `${endDate.getHours() % 12 || 12}:${endDate.getMinutes().toString().padStart(2, '0')} ${endDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    
    return `${startTime}~${endTime}`;
  };

  const removeSlot = async (slotIndex) => {
    const slot = bookedSlots[slotIndex];
    const endTime = new Date(slot.endTime);
    const currentTime = new Date();

    if (currentTime >= endTime) {
      try {
        // Make backend API request to remove the slot permanently
        const response = await axios.post(`http://10.1.17.148:5000/api/stations/${stationId}/removeSlot`, {
          pointNumber: pointNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });

        if (response.data.success) {
          Alert.alert("Success", "Slot has been removed");
          
          // Remove from local state
          setBookedSlots(prevSlots => prevSlots.filter((_, index) => index !== slotIndex));
        } else {
          Alert.alert("Error", response.data.message || "Failed to remove slot.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong while removing the slot.");
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserDetails();
      await fetchChargingPoints();
    };
    init();
  }, []);

  const filterPastSlots = (slots) => {
    const currentTime = new Date();
    return slots.filter(slot => new Date(slot.endTime) > currentTime);
  };

  const filteredSlots = filterPastSlots(bookedSlots);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book a Slot</Text>

      <Text>Select Charging Point:</Text>
      <Picker
        selectedValue={pointNumber}
        onValueChange={(value) => onPointChange(value)}
      >
        {chargingPoints.map((point) => (
          <Picker.Item
            key={point.pointNumber}
            label={`Point ${point.pointNumber}`}
            value={point.pointNumber}
          />
        ))}
      </Picker>

      <TimeSelector label="Start Time:" value={startTime} onChange={setStartTime} />
      <TimeSelector label="End Time:" value={endTime} onChange={setEndTime} />

      <Button title="Book Slot" onPress={bookSlot} />

      <Text style={styles.subtitle}>Already Booked Slots:</Text>
      {filteredSlots.length === 0 ? (
        <Text>No bookings yet</Text>
      ) : (
        filteredSlots.map((slot, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.slotBox} onPress={() => removeSlot(index)}>
              <Text>{formatTimeSlot(slot.startTime, slot.endTime)}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  slotBox: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default BookSlot;