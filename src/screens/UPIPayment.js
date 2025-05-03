import React from 'react';
import { View, Button, Alert, Linking, StyleSheet, Text } from 'react-native';

const UPIPayment = ({ amount }) => {
  const payeeVPA = 'Q167630538@ybl'; // Replace with your actual UPI ID
  const payeeName = 'ANUPAMA AVENUE';

  const makeUPIPayment = async () => {
    if (!amount) {
      Alert.alert('Amount required', 'Bill amount missing');
      return;
    }

    const upiURL = `upi://pay?pa=${payeeVPA}&pn=${payeeName}&tn=Payment&am=${amount}&cu=INR`;

    const supported = await Linking.canOpenURL(upiURL);
    if (supported) {
      Linking.openURL(upiURL).catch((err) =>
        Alert.alert('Error', 'Unable to open UPI app.')
      );
    } else {
      Alert.alert('No UPI App Found', 'Install a UPI app like Google Pay or PhonePe.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bill Amount: ₹{amount}</Text>
      <Button title="Pay with UPI" onPress={makeUPIPayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 20, backgroundColor: '#eee', borderRadius: 10 },
  label: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' }
});

export default UPIPayment;
