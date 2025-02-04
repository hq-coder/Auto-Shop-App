import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import logo from '../images/templogo.jpg';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Frontapi from '../Frontapi';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Business form fields
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');
  const [customerName, setCustomerName] = useState('');
const [customerPhone, setCustomerPhone] = useState('');
const [customerAddress, setCustomerAddress] = useState('');
const togglePasswordVisibility = () => {
  setIsPasswordVisible(!isPasswordVisible);
};


  const serviceOptions = [
    'Auto Body Repair',
    'Oil Change',
    'Brake Repair',
    'Tire Replacement',
    'Engine Diagnostics',
    'Transmission Repair',
    'Battery Replacement',
    'Suspension Repair',
    'Other',
  ];

 // Handle Sign-Up
const handleSignUp = async () => {
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  const userData = {
    email,
    password,
    role: isBusiness ? 'business' : 'customer',
    ...(isBusiness
      ? {
          name: businessName,
          phone: businessPhone,
          address: businessAddress,
          business_type: service === 'Other' ? customService : service,
        }
      : {
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
        }),
  };

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);

    if (response.status === 201) {
      // Automatically log in after registration
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: userData.email,
        password: userData.password,
      });

      if (loginResponse.status === 200) {
        Alert.alert('Welcome', `Hello, ${loginResponse.data.user.email}`);
        navigation.navigate('Home'); // Redirect to the Home screen
      } else {
        Alert.alert('Error', 'Login failed. Please try manually.');
      }
    } else {
      Alert.alert('Error', response.data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Sign-Up/Login Error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'Internal server error');
  }

    

    try {
      const response = await Frontapi.registerUser(userData);
      if (response.status === 200) {
  const { user } = response.data;
  setIsLoggedIn(true); // Update state here
  navigation.navigate(user.role === 'customer' ? 'CustomerProfile' : 'BusinessProfile');
}

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully');
        setIsSignUp(false); // Redirect to login
      }
    } catch (error) {
      console.error('Error during signup:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  // Handle Login
  const handleLogin = async () => {
    try {
        const userData = { email, password };
        const response = await Frontapi.loginUser(userData);
        if (response) {
            const { user } = response;
            Alert.alert('Login Successful', `Welcome back, ${user.email}`);
            
            // Navigate based on role
            if (user.role === 'customer') {
                navigation.navigate('CustomerProfile'); // Redirect to Customer Profile
            } else if (user.role === 'business') {
                navigation.navigate('BusinessProfile'); // Redirect to Business Profile
            }
        }
    } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        Alert.alert('Error', 'Invalid email or password. Please try again.');
    }
    setIsLoggedIn(true);
};

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogin = async () => {
    try {
      const userData = { email, password };
      const response = await Frontapi.loginUser(userData);
      if (response.status === 200) {
        const { user } = response.data;
        setIsLoggedIn(true); // Update login state
        Alert.alert('Login Successful', `Welcome back, ${user.email}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password. Please try again.');
    }
  };
};



  return (
    <View style={styles.container}>
      {/* Logo and Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.button, !isBusiness && styles.activeButton]}
          onPress={() => setIsBusiness(false)}
        >
          <Text style={styles.buttonText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isBusiness && styles.activeButton]}
          onPress={() => setIsBusiness(true)}
        >
          <Text style={styles.buttonText}>Business</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
  <Text style={styles.title}>
    {isSignUp
      ? isBusiness
        ? 'Business Sign Up'
        : 'Customer Sign Up'
      : isBusiness
      ? 'Business Login'
      : 'Customer Login'}
  </Text>

  {/* Business Sign-Up Fields */}
  {isSignUp && isBusiness && (
    <>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={businessPhone}
        onChangeText={setBusinessPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={businessAddress}
        onChangeText={setBusinessAddress}
      />
      <Text style={styles.label}>Services Offered</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={service}
          onValueChange={(itemValue) => {
            setService(itemValue);
            if (itemValue !== 'Other') setCustomService('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select a service" value="" />
          {serviceOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>
      {service === 'Other' && (
        <TextInput
          style={styles.input}
          placeholder="Specify your service"
          value={customService}
          onChangeText={setCustomService}
        />
      )}
    </>
  )}

  {/* Email Input */}
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  </View>

  {/* Password Input */}
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry={!isPasswordVisible}
      value={password}
      onChangeText={setPassword}
    />
    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      <Icon
        name={isPasswordVisible ? 'eye' : 'eye-slash'}
        size={20}
        color="#aaa"
      />
    </TouchableOpacity>
  </View>

  {/* Confirm Password for Sign-Up */}
  {isSignUp && (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
    </View>
  )}

  {/* Sign Up or Login Button */}
  <TouchableOpacity
    onPress={isSignUp ? handleSignUp : handleLogin}
    style={styles.button}
  >
    <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
  </TouchableOpacity>

  {/* Toggle Sign-Up/Login */}
  <TouchableOpacity
    onPress={() => setIsSignUp(!isSignUp)}
    style={styles.button}
  >
    <Text style={styles.buttonText}>
      {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
    </Text>
  </TouchableOpacity>

  {/* Continue as Guest */}
  <TouchableOpacity onPress={() => setIsGuest(true)} style={styles.button}>
    <Text style={styles.buttonText}>Continue as Guest</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#121212', // Dark background color
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 300,
      height: 100,
      resizeMode: 'contain',
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 15, // Shadow for Android
     
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff', // White text for dark mode
      marginTop: 10,
    },
    tabSelector: {
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'center',
    },
    formContainer: {
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#ffffff', // White text
    },
    input: {
      width: '100%',
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#bbb', // Light border for dark background
      backgroundColor: '#333', // Dark background for inputs
      color: '#fff', // White text inside inputs
    },
    pickerContainer: {
      width: '100%',
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#bbb',
      backgroundColor: '#333',
    },
    picker: {
      height: 50,
      width: '100%',
      color: '#fff', // White text for the picker
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: 'red', // White label text
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: 'red',
      backgroundColor: 'black',
      shadowColor: 'red',
      shadowOffset: { width: 10, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 10, // For Android shadow
      borderRadius: 5,
    },
    activeButton: {
      borderColor: '#6200ea',
    },
    buttonText: {
      color: 'red',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    inputContainer: {
      flexDirection: 'row', // Places TextInput and Icon horizontally
      alignItems: 'center', // Aligns items vertically in the center
      width: '100%',
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#bbb',
      backgroundColor: '#333', // Dark background for the input
    },
    input: {
      flex: 1, // Takes up the remaining space
      padding: 12,
      color: '#fff',
    },
    iconContainer: {
      padding: 10, // Adds space around the icon for better touchability
    },
  
  });
  

export default LoginScreen;
