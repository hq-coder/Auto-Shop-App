import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CustomerProfileScreen = () => {
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [vehicleInfo, setVehicleInfo] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
  });

  const handleImagePicker = async (setImage) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access the gallery is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE], // Updated to use `ImagePicker.MediaType`
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSave = () => {
    if (!personalInfo.name || !personalInfo.phone || !personalInfo.email) {
      Alert.alert('Validation Error', 'Please complete all personal information fields.');
      return;
    }

    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.year || !vehicleInfo.vin) {
      Alert.alert('Validation Error', 'Please complete all vehicle information fields.');
      return;
    }

    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your account information has been successfully updated.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={
            personalPhoto
              ? { uri: personalPhoto }
              : require('../images/default-avatar.jpg') // Replace with a default avatar image
          }
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>
          {personalInfo.name || 'Your Name'}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing((prev) => !prev)}
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit Account'}</Text>
        </TouchableOpacity>
      </View>

      {/* Editable Fields */}
      {isEditing && (
        <View style={styles.form}>
          <Text style={styles.sectionHeader}>Personal Information</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleImagePicker(setPersonalPhoto)}
          >
            <Text style={styles.uploadButtonText}>Upload Personal Photo</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={personalInfo.name}
            onChangeText={(text) => setPersonalInfo((prev) => ({ ...prev, name: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={personalInfo.phone}
            onChangeText={(text) => setPersonalInfo((prev) => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={personalInfo.email}
            onChangeText={(text) => setPersonalInfo((prev) => ({ ...prev, email: text }))}
            keyboardType="email-address"
          />

          <Text style={styles.sectionHeader}>Vehicle Information</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleImagePicker(setVehiclePhoto)}
          >
            <Text style={styles.uploadButtonText}>Upload Vehicle Photo</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Make"
            value={vehicleInfo.make}
            onChangeText={(text) => setVehicleInfo((prev) => ({ ...prev, make: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            value={vehicleInfo.model}
            onChangeText={(text) => setVehicleInfo((prev) => ({ ...prev, model: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Year"
            value={vehicleInfo.year}
            onChangeText={(text) => setVehicleInfo((prev) => ({ ...prev, year: text }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="VIN"
            value={vehicleInfo.vin}
            onChangeText={(text) => setVehicleInfo((prev) => ({ ...prev, vin: text }))}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display Vehicle Photo */}
      {!isEditing && vehiclePhoto && (
        <View style={styles.vehiclePhotoContainer}>
          <Image
            source={{ uri: vehiclePhoto }}
            style={styles.vehiclePhoto}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: 'red',
    borderWidth: 1,
  },
  uploadButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vehiclePhotoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  vehiclePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default CustomerProfileScreen;
