// components/TimeSelector.js
import React, { useState } from 'react';
import { View, Text, Modal, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimeSelector = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  const showPicker = () => setShow(true);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate); // Pass real Date object
    }
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) return 'Select Time'; // 💥 important fix

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;
    const formattedHours = ((hours + 11) % 12 + 1).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <Pressable onPress={showPicker} style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 6 }}>
        <Text>{formatTime(value)}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="time"
          value={value instanceof Date ? value : new Date()} // 👈 use correct value
          is24Hour={false}
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default TimeSelector;
