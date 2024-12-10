import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { DefaultTheme } from '@react-navigation/native';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import EstimateScreen from './src/screens/EstimateScreen';
import LoginScreen from './src/screens/LoginScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import LoginRequired from './src/screens/LoginRequiredScreen';

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
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'red' }, // Red for the header
          headerTintColor: 'black',
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => <HomeTab isLoggedIn={isLoggedIn} isGuest={isGuest} setIsGuest={setIsGuest} />}
        </Stack.Screen>
        <Stack.Screen name="LoginRequired" component={LoginRequired} />
        <Stack.Screen name="Estimate" component={EstimateScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Services" children={(props) => (
          <LoggedInCheck
            isLoggedIn={isLoggedIn || isGuest}
            isGuest={isGuest}
            setIsGuest={setIsGuest}
            {...props}
          >
            <ServicesScreen {...props} />
          </LoggedInCheck>
        )} />
        <Stack.Screen name="Schedule" children={(props) => (
          <LoggedInCheck
            isLoggedIn={isLoggedIn || isGuest}
            isGuest={isGuest}
            setIsGuest={setIsGuest}
            {...props}
          >
            <ScheduleScreen {...props} />
          </LoggedInCheck>
        )} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTab({ isLoggedIn, isGuest, setIsGuest }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: 'black' }, // Black background for tab bar
        tabBarActiveTintColor: 'white', // White for active icons/text
        tabBarInactiveTintColor: 'red', // Red for inactive icons/text
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Estimate"
        component={EstimateScreen}
        options={{
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
          tabBarIcon: ({ color, size }) => (
            <Icon name="tools" color={color} size={size} />
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
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="key" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
