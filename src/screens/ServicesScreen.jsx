import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

// Move images array outside the component
const images = [
  require('../images/1.png'),
  require('../images/2.png'),
  require('../images/3.png'),
  require('../images/4.png'),
  require('../images/5.png'),
  require('../images/6.png'),
  require('../images/7.png'),
  require('../images/8.png'),
  require('../images/9.png'),
  require('../images/10.png'),
];

const ServicesScreen = ({ isGuest, setIsGuest }) => {
  // ... [Keep all your existing state variables] ...

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const getImageStyle = (index) => {
    return useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * height,
        index * height,
        (index + 1) * height,
      ];

      const opacity = interpolate(
        scrollY.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      const scale = interpolate(
        scrollY.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Image Stack */}
      <View style={styles.imageStack}>
        {images.map((img, index) => (
          <Animated.View key={index} style={[styles.imageContainer, getImageStyle(index)]}>
            <Image source={img} style={styles.image} />
          </Animated.View>
        ))}
      </View>

      {/* Rest of your component remains the same */}
      {/* ... */}
    </Animated.ScrollView>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#333',
    marginVertical: 10,
  },
  inputAndroid: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#333',
    marginVertical: 10,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageStack: {
    height: images.length * height, // Now accessible here
  },
  imageContainer: {
    height: height,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: images.length * height,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'red',
    color: '#fff',
    backgroundColor: '#333',
  },
  orText: {
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  footer: {
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  footerTextBold: {
    fontWeight: 'bold',
  },
});

export default ServicesScreen;