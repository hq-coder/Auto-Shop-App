import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LoggedInCheck = ({ isLoggedIn, isGuest, setIsGuest, children, navigation }) => {
  if (!isLoggedIn && !isGuest) {
    // Render the LoginRequiredScreen overlay
    return (
      <View style={styles.overlay}>
        <Text style={styles.warningText}>
          You need to be logged in to access this page
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => setIsGuest(true)} // Set isGuest to true
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If logged in or in guest mode, render the actual content
  return children;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  loginButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guestButton: {
    marginTop: 20,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  guestButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoggedInCheck;
