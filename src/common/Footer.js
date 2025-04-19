import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, History, User } from 'lucide-react-native'; // Import icons

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerItem}>
        <Home color="#333" size={24} />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Booking')} style={styles.footerItem}>
        <History color="#333" size={24} />
        <Text style={styles.footerText}>Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.footerItem}>
        <User color="#333" size={24} />
        <Text style={styles.footerText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    zIndex: 999,
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});

export default Footer;
