import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EstimateScreen = () => {
  const [name, setName] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [images, setImages] = useState([]);

  // Mock image upload handler
  const handleImageUpload = () => {
    if (images.length < 3) {
      const newImage = { uri: 'placeholder-image.jpg', id: images.length + 1 }; // Mock image
      setImages([...images, newImage]);
    } else {
      Alert.alert('Upload Limit', 'You can upload up to 3 pictures only.');
    }
  };

  const handleSubmit = () => {
    if (
      !name ||
      !vehicleYear ||
      !make ||
      !model ||
      !description ||
      !paymentMethod ||
      !contactInfo
    ) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (images.length < 3) {
      Alert.alert('Validation Error', 'Please upload at least 3 images.');
      return;
    }

    // Send form via email using mailto
    const mailtoLink = `mailto:nextlevelchampions90@gmail.com?subject=Estimate Request&body=Name: ${name}%0AVehicle Year: ${vehicleYear}%0AMake: ${make}%0AModel: ${model}%0ADescription: ${description}%0APayment Method: ${paymentMethod}%0AContact Info: ${contactInfo}%0AImages: ${images.map(
      (img) => img.uri
    ).join(', ')}`;

    Linking.openURL(mailtoLink);

    Alert.alert(
      'Estimate Submitted',
      'Your estimate has been submitted to the Repair Facility. Please allow 1 business day for a reply. Any further questions, feel free to call the office at (516)333-6666.'
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo and Title */}
      <View style={styles.header}>
        <Image source={require('../images/templogo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Request an Estimate</Text>
      </View>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#ff0000" // Red placeholder text color
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Year"
        value={vehicleYear}
        onChangeText={setVehicleYear}
        keyboardType="numeric"
        placeholderTextColor="#ff0000" // Red placeholder text color
      />
      <TextInput
        style={styles.input}
        placeholder="Make"
        value={make}
        onChangeText={setMake}
        placeholderTextColor="#ff0000" // Red placeholder text color
      />
      <TextInput
        style={styles.input}
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        placeholderTextColor="#ff0000" // Red placeholder text color
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Brief Description of the Damage"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor="#ff0000" // Red placeholder text color
      />

      <Text style={styles.label}>Payment Method</Text>
      <Picker
        selectedValue={paymentMethod}
        style={styles.picker}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        placeholderTextColor="#ff0000" // Red placeholder text color
      >
        <Picker.Item label="Select Payment Method" value="" />
        <Picker.Item label="Insurance" value="insurance" />
        <Picker.Item label="Cash" value="cash" />
        <Picker.Item label="Credit Card" value="credit_card" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Contact Information"
        value={contactInfo}
        onChangeText={setContactInfo}
        placeholderTextColor="#ff0000" // Red placeholder text color
      />

      <Text style={styles.label}>Upload Pictures</Text>
      {images.length < 3 && (
        <Button title="Upload Picture" onPress={handleImageUpload} />
      )}
      <View style={styles.imagePreviewContainer}>
        {images.map((image) => (
          <View key={image.id} style={styles.imageWrapper}>
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>

      <Text style={styles.note}>
        Notes: Upload at least 3 pictures. Include a photo of the VIN, a photo
        of the damage, and a distant photo of the entire vehicle from the
        damaged side.
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Estimate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#000', // Black background
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ff0000', // Red border
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#000', // Black background for input fields
    color: '#ff0000', // Red text
    shadowColor: '#800080', // Purple shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  picker: {
    borderWidth: 2,
    borderColor: '#ff0000',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#000',
    color: '#ff0000',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageWrapper: {
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  note: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default EstimateScreen;
