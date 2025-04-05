import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { button1 } from '../common/button';
import userIcon from '../../assets/userIcon.png';
import passwordIcon from '../../assets/passwordIcon.png';
import EmailIcon from '../../assets/EmailIcon.png';
import contactIcon from '../../assets/contactIcon.png';

const SignUp = ({ navigation }) => {
  // State to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Backend API URL (replace with your actual backend URL)
  const API_URL = 'http://10.1.17.148:5001/api/auth/signup';

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!username || !email || !contactNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        username,
        email,
        contactNumber,
        password,
      });

      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('userlogin'); // Navigate to login screen after successful signup
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.Container}>
        <Text style={styles.text}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image source={userIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Username"
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Image source={EmailIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Email Id"
              placeholderTextColor="#777"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Image source={contactIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Contact Number"
              placeholderTextColor="#777"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
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

          <View style={styles.inputWrapper}>
            <Image source={passwordIcon} style={styles.icon} />
            <TextInput
              style={styles.InputText}
              placeholder="Confirm Password"
              placeholderTextColor="#777"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSignUp}>
          <Text style={button1}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('userlogin')}>
            <Text style={styles.link}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

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
  loginContainer: {
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
