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
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const isPM = hours >= 12;
      const formattedHours = ((hours + 11) % 12 + 1).toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedTime = `${formattedHours}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;
      onChange(formattedTime);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <Pressable onPress={showPicker} style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 6 }}>
        <Text>{value}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour={false}
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default TimeSelector;