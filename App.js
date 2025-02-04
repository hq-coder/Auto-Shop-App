import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native'; // Import Platform and StatusBar
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import EstimateScreen from './src/screens/EstimateScreen';
import LoginScreen from './src/screens/LoginScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import LoginRequired from './src/screens/LoginRequiredScreen';
import CustomerProfileScreen from './src/screens/CustomerProfileScreen';
import BusinessProfileScreen from './src/screens/BusinessProfileScreen';

// Import LoggedInCheck Component
import LoggedInCheck from './src/LoggedInCheck';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black', // Black text/icons for active items
    background: 'red', // Red background for the navigation
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login status
  const [isGuest, setIsGuest] = useState(false); // Track guest mode

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']} // Apply padding only to the top
    >
      <NavigationContainer theme={MyTheme}>
      
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: 'red' }, // Red for the header
            headerTintColor: 'black',
            headerShown: false, // Hide header globally
          }}
        >
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {() => <HomeTab isLoggedIn={isLoggedIn} isGuest={isGuest} setIsGuest={setIsGuest} />}
          </Stack.Screen>
          <Stack.Screen name="LoginRequired" options={{ headerShown: false }} component={LoginRequired} />
          <Stack.Screen name="Estimate" options={{ headerShown: false }} component={EstimateScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
          <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />

          <Stack.Screen
            name="Services"
            options={{ headerShown: false }}
            children={(props) => (
              <LoggedInCheck
                isLoggedIn={isLoggedIn || isGuest}
                isGuest={isGuest}
                setIsGuest={setIsGuest}
                {...props}
              >
                <ServicesScreen {...props} />
              </LoggedInCheck>
            )}
          />
          <Stack.Screen
            name="Schedule"
            options={{ headerShown: false }}
            children={(props) => (
              <LoggedInCheck
                isLoggedIn={isLoggedIn || isGuest}
                isGuest={isGuest}
                setIsGuest={setIsGuest}
                {...props}
              >
                <ScheduleScreen {...props} />
              </LoggedInCheck>
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensure SafeAreaView takes up the entire screen
    backgroundColor: 'red',
    marginBottom:-10, 
  },
});

function HomeTab({ isLoggedIn, isGuest, setIsGuest, setIsLoggedIn }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: 'black' }, // Black background for tab bar
          tabBarActiveTintColor: 'white', // White for active icons/text
          tabBarInactiveTintColor: 'red', // Red for inactive icons/text
          headerShown: false, // Hide header for all tabs
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home', // Change the tab label to "Home"
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Estimate"
          component={EstimateScreen}
          options={{
            tabBarLabel: 'Estimate', // Ensure the tab label is "Estimate"
            tabBarIcon: ({ color, size }) => (
              <Icon name="cash" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Services"
          children={(props) => (
            <LoggedInCheck
              isLoggedIn={isLoggedIn || isGuest}
              isGuest={isGuest}
              setIsGuest={setIsGuest}
              {...props}
            >
              <ServicesScreen {...props} />
            </LoggedInCheck>
          )}
          options={{
            tabBarLabel: 'Services', // Ensure the tab label is "Services"
            tabBarIcon: ({ color, size }) => (
              <Icon name="construct" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          children={(props) => (
            <LoggedInCheck
              isLoggedIn={isLoggedIn || isGuest}
              isGuest={isGuest}
              setIsGuest={setIsGuest}
              {...props}
            >
              <ScheduleScreen {...props} />
            </LoggedInCheck>
          )}
          options={{
            tabBarLabel: 'Schedule', // Ensure the tab label is "Schedule"
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" color={color} size={size} />
            ),
          }}
        />
        {isLoggedIn ? (
          <Tab.Screen
            name="Account"
            children={(props) => (
              <CustomerOrBusinessScreen
                isGuest={isGuest}
                userRole={isLoggedIn ? 'customer' : 'business'} // Replace with actual role from your state or context
                {...props}
              />
            )}
            options={{
              tabBarLabel: 'Account', // Ensure the tab label is "Account"
              tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Login"
            children={(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            options={{
              tabBarLabel: 'Login', // Ensure the tab label is "Login"
              tabBarIcon: ({ color, size }) => (
                <Icon name="log-in" color={color} size={size} />
              ),
            }}
          />
        )}
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}

function CustomerOrBusinessScreen({ isGuest, userRole }) {
  if (isGuest) {
    return <CustomerProfileScreen />;
  }

  return userRole === 'business' ? <BusinessProfileScreen /> : <CustomerProfileScreen />;
}
