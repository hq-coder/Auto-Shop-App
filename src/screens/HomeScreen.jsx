import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, ImageBackground, Linking, Platform } from 'react-native'; // Import Linking and Platform
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { Rating } from 'react-native-ratings';

const HomeScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const shopInfo = {
    name: 'Next Level Champions',
    address: '90 New York Ave, Westbury, NY 11590',
    phone: '(516) 333-6666',
    coordinates: {
      latitude: 40.75839,
      longitude: -73.56056
    }
  };

  // Fetch Google Reviews data from API
  const fetchGoogleReviews = async () => {
    const apiKey = 'AIzaSyAJSTWqDWcGZtra32ZpZ3cf3ym5KwKlmJc';
    const placeId = 'ChIJLy9hpzSHwokRmetj28qjh-c'; // Replace with actual Google Place ID
    
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`
      );
      const reviewsData = response.data.result.reviews.filter(
        (review) => review.rating >= 4
      );
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching Google Reviews:', error);
    }
  };

  // Fade effect function
  const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    });
  };

    // Auto-scrolling animation for services
    const startScrollAnimation = () => {
      Animated.loop(
        Animated.timing(scrollAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        })
      ).start();
    };
  

  useEffect(() => {
    fetchGoogleReviews();
    startScrollAnimation();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => fadeInOut(), 4000); // Change review every 4 seconds
      return () => clearInterval(interval); // Clean up interval
    }
  }, [reviews]);



  const servicesText = `
    Welcome to Next Level Champions Auto Body Shop!

    We specialize in providing top-notch services to restore and enhance your vehicles:
    - Collision Repair
    - Insurance Claims Assistance
    - Full Paint Jobs
    - Rim Repair
    - Small & Big Dent Repairs
    - Paintless Dent Removal (PDR)
    - Jet Ski & Motorcycle Repairs
    - State-of-the-Art Equipment

    Whether it’s a small scratch or major damage, our skilled technicians ensure your vehicle looks its best. Your satisfaction is our priority!
  `;

  const translateY = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });


  // Helper function to shorten review text
  const shortenReviewText = (text) => {
    const words = text.split(' ');
    return words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
  };

  // Function to handle opening the address in the map
  const openMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${shopInfo.address}`, // For Apple Maps on iOS
      android: `google.navigation:q=${shopInfo.address}`, // For Google Maps on Android
    });

    Linking.openURL(url)
      .catch((err) => console.error('Error opening map:', err));
  };

  return (
    <ImageBackground
      source={require('../images/garagedoor.jpg')} // Background image
      style={styles.container} // Apply the background to the container
    >
      <View style={styles.container}>
        {/* Logo and Header */}
        <View style={styles.header}>
          <Image source={require('../images/templogo.jpg')} style={styles.logo} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {/* Paragraph */}
        <View style={styles.servicesContainer}>
            <Animated.Text
              style={[styles.servicesText, { transform: [{ translateY }] }]}
            >
              {servicesText}
            </Animated.Text>
          </View>
          
          {/* Google Reviews */}
          <View style={styles.reviewsContainer}>
            {reviews.length > 0 && (
              <Animated.View style={[styles.review, { opacity: fadeAnim }]}>
                <Text style={styles.reviewAuthor}>{reviews[currentReviewIndex].author_name}</Text>
                <Text style={styles.reviewText}>{shortenReviewText(reviews[currentReviewIndex].text)}</Text>
                <View style={styles.reviewRating}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={20}
                    readonly
                    startingValue={reviews[currentReviewIndex].rating}
                  />
                </View>
              </Animated.View>
            )}
          </View>

    {/* Shop Info */}
    <View style={styles.shopInfoContainer}>
            <Text style={styles.shopInfoText} onPress={openMap}>
              {shopInfo.address}
            </Text>
            <Text style={styles.shopInfoText}>{shopInfo.phone}</Text>
          </View>


          {/* Google Map with Shop Location */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: shopInfo.coordinates.latitude,
                longitude: shopInfo.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={shopInfo.coordinates} title={shopInfo.name} description={shopInfo.address} />
            </MapView>
          </View>

      
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by <Text style={styles.footerTextBold}>{"<hqCoder/>"}</Text></Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.8)', // Use rgba for transparency
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'red',
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },

  servicesContainer: {
    height: 500,
    overflow: 'hidden',
    marginVertical: 20,
  },
  servicesText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'cover',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  reviewsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  review: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAuthor: {
    fontFamily: 'cursive', // Use a script font like cursive or add custom font
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  reviewText: {
    fontFamily: 'Pacifico-Regular',
    color: 'white',
    marginBottom: 5,
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  reviewRating: {
    marginTop: 2,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
  },
  noReviewsText: {
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  shopInfoContainer: {
    backgroundColor: 'transparent',  // No background
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',  // Center the content vertically
    alignItems: 'center',      // Center the content horizontally
    flexDirection: 'column',   // Stack the text elements vertically
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 4,
    shadowRadius: 20,
    elevation: 15,
  },
  shopInfoText: {
    color: '#fff',
    fontSize: 24,              // Larger font size
    marginBottom: 10,          // Even spacing between text
    fontWeight: 'bold',        // Make text bold
    textAlign: 'center',       // Center-align the text
  },
  
  footer: {
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  footerTextBold: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
