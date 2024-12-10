import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import logo from '../images/templogo.jpg';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation, route, }) => {
  const [isGuest, setIsGuest] = useState(false); // Define setIsGuest
  const [isBusiness, setIsBusiness] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Business form fields
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');

  const serviceOptions = [
    'Oil Change',
    'Brake Repair',
    'Tire Replacement',
    'Engine Diagnostics',
    'Transmission Repair',
    'Battery Replacement',
    'Suspension Repair',
    'Other',
  ];

  const handleSignUp = async () => {
    try {
      if (isBusiness) {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        const selectedService = service === 'Other' ? customService : service;

        // Add authentication logic here (e.g., Firebase)
        alert(`Business account created for ${businessName}, offering ${selectedService}`);
      } else {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        // Add authentication logic here (e.g., Firebase)
        alert(`Customer account created for ${email}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      // Add authentication logic here (e.g., Firebase)
      alert(`${isBusiness ? 'Business' : 'Customer'} Login for ${email}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
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

        {isSignUp && isBusiness && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
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
              placeholder="Business Address"
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

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <TouchableOpacity
          onPress={isSignUp ? handleSignUp : handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Add Guest Login Button */}
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
  });
  

export default LoginScreen;
