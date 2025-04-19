// components/SearchBar.js

import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const SearchBar = ({ searchQuery, onChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by station name or address"
        value={searchQuery}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor="#888"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#333',
  },
});
