import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';  // ✅ Import AsyncStorage
import { button1 } from '../common/button';
import userIcon from '../../assets/userIcon.png';
import passwordIcon from '../../assets/passwordIcon.png';

const UserLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email?.trim() || !password?.trim()) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://10.1.17.148:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.user._id;
        
        // ✅ Store userId in AsyncStorage
        await AsyncStorage.setItem("userId", userId);
        console.log("Stored userId:", userId);

        navigation.navigate('home');  
      } else {
        Alert.alert('Error', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.Container}>
        <Text style={styles.text}>Welcome...!</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image source={userIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Image source={passwordIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Password"
              placeholderTextColor="#777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleLogin}>
          <Text style={button1}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signInText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserLogin;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Container: {
    width: '90%',
    backgroundColor: '#eef2ec',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2DBE7C',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginVertical: 12,
    height: 50,
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  InputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#333',
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#000',
  },
  link: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#2DBE7C',
    fontWeight: 'bold',
  },
});
