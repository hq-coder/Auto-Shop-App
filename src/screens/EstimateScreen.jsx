import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Linking, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  ImageBackground, 
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-picker';

const EstimateScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: '',
    preferredTime: '',
    vehicleYear: '',
    make: '',
    model: '',
    paymentMethod: '',
    description: '',
    insuranceClaimFiled: null,
    insuranceName: '',
    policyNumber: '',
    claimNumber: '',
    adjusterName: '',
    adjusterNumber: '',
    claimHandlerName: '',
    claimHandlerNumber: '',
    policeReport: null,
    accidentDate: '',
    injuries: false,
    atFault: '',
  });
  const [images, setImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const handleImageUpload = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (!response.didCancel && !response.error) {
        if (images.length < 4) {
          setImages([...images, { uri: response.uri, id: Date.now() }]);
        } else {
          Alert.alert('Upload Limit', 'Maximum 4 photos allowed');
        }
      }
    });
  };

   // Update handleSubmit to include damage description
   const handleSubmit = () => {
    const emailBody = Object.entries(formData)
      .filter(([key]) => !['insuranceClaimFiled', 'policeReport'].includes(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
      + `\n\nImages Uploaded: ${images.length}`;

    const emailLink = `mailto:nextlevelchampions90@gmail.com?subject=**ESTIMATE**&body=${encodeURIComponent(emailBody)}`;
    Linking.openURL(emailLink);
    setIsSubmitted(true);
  };

  // Function to reset specific fields when navigating
  const resetStepFields = (currentStep, direction) => {
    if (direction === 'next') {
      switch (currentStep) {
        case 1:
          // Clear step 1 fields when moving to step 2
          setFormData(prev => ({
            ...prev,
            name: '',
            contactMethod: '',
            preferredTime: '',
          }));
          break;
        case 2:
          // Clear step 2 fields when moving to step 3
          setFormData(prev => ({
            ...prev,
            vehicleYear: '',
            make: '',
            model: '',
          }));
          break;
        // Add more cases if needed
        default:
          break;
      }
    } else if (direction === 'back') {
      switch (currentStep) {
        case 2:
          // Clear step 2 fields when going back to step 1
          setFormData(prev => ({
            ...prev,
            vehicleYear: '',
            make: '',
            model: '',
          }));
          break;
        case 3:
          // Clear step 3 fields when going back to step 2
          setFormData(prev => ({
            ...prev,
            paymentMethod: '',
          }));
          break;
        // Add more cases if needed
        default:
          break;
      }
    }
  };

  // Update navigation handlers
  const handleNext = () => {
    resetStepFields(step, 'next'); // Clear current step fields
    if (step === 3 && formData.paymentMethod === 'insurance') {
      setShowInsuranceModal(true);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    resetStepFields(step, 'back'); // Clear current step fields
    setStep(prev => prev - 1);
  };

  const renderInsuranceClaimModal = () => (
    <Modal visible={showInsuranceModal} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.insuranceModal}>
          <Text style={styles.modalTitle}>Insurance Claim Filed?</Text>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => {
              setFormData(prev => ({...prev, insuranceClaimFiled: true}));
              setShowInsuranceModal(false);
              setStep(5);
            }}
          >
            <Text style={styles.modalButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => {
              setFormData(prev => ({...prev, insuranceClaimFiled: false}));
              setShowInsuranceModal(false);
              setStep(6);
            }}
          >
            <Text style={styles.modalButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderInsuranceDetails = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Insurance Company Name"
        onChangeText={text => setFormData(prev => ({...prev, insuranceName: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Policy Number"
        onChangeText={text => setFormData(prev => ({...prev, policyNumber: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Claim Number"
        onChangeText={text => setFormData(prev => ({...prev, claimNumber: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Adjuster Name"
        onChangeText={text => setFormData(prev => ({...prev, adjusterName: text}))}
      />
      <TextInput
        style={styles.input}
        placeholder="Adjuster Phone Number"
        keyboardType="phone-pad"
        onChangeText={text => setFormData(prev => ({...prev, adjusterNumber: text}))}
      />
    </>
  );

  const renderPoliceReport = () => (
    <>
   <TouchableOpacity
  style={styles.uploadButton}
  onPress={() => {
    /* Implement document picker */
    Alert.alert('Upload Police Report', 'PDF or photo upload functionality would go here');
  }}
>
  <Text style={styles.uploadButtonText}>Upload Police Report</Text>
</TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Date of Accident (MM/DD/YYYY)"
        onChangeText={text => setFormData(prev => ({...prev, accidentDate: text}))}
      />
      <View style={styles.faultContainer}>
        <Text style={styles.faultLabel}>"To assist with your claim, please specify which party was responsible for the collision."</Text>
        {['My Vehicle', 'Other Vehicle', 'Not Sure'].map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.faultOption, formData.atFault === option && styles.selectedFault]}
            onPress={() => setFormData(prev => ({...prev, atFault: option}))}
          >
            <Text style={styles.faultText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderStep = () => {
    switch(step) {
      case 1: return (
        <>
          <Text style={styles.label}>Your Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={text => setFormData(prev => ({...prev, name: text}))}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Method (Phone/Email)"
            onChangeText={text => setFormData(prev => ({...prev, contactMethod: text}))}
          />
          <TextInput
            style={styles.input}
            placeholder="Preferred Contact Time"
            onChangeText={text => setFormData(prev => ({...prev, preferredTime: text}))}
          />
        </>
      );
      
      case 2: return (
        <>
          <Text style={styles.label}>Vehicle Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Vehicle Year"
            keyboardType="numeric"
            onChangeText={text => setFormData(prev => ({...prev, vehicleYear: text}))}
          />
          <TextInput
            style={styles.input}
            placeholder="Make"
            onChangeText={text => setFormData(prev => ({...prev, make: text}))}
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            onChangeText={text => setFormData(prev => ({...prev, model: text}))}
          />
        </>
      );

      case 3: 
      return (
        <View style={styles.step3Container}>
          <Text style={styles.label}>Payment Method</Text>
          <Picker
            selectedValue={formData.paymentMethod}
            onValueChange={value => setFormData(prev => ({...prev, paymentMethod: value}))}
            style={styles.picker}
          >
            <Picker.Item label="Select Payment Method" value="" />
            <Picker.Item label="Insurance" value="insurance" />
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Credit Card" value="credit_card" />
          </Picker>
          {renderInsuranceClaimModal()}
        </View>
      );



      case 4:
        return (
          <>
            <Text style={styles.damageTitle}>Damage Documentation</Text>
            <Text style={styles.damageNote}>
              Required Images:
              {'\n'}1. Full vehicle context shot showing damage location
              {'\n'}2. Close-up damage detail (primary angle)
              {'\n'}3. Supplemental damage angle (orthogonal view)
              {'\n'}4. Legible VIN plate capture
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageUpload}
            >
              <Text style={styles.uploadButtonText}>Select Photos</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
              {images.map(img => (
                <Image key={img.id} source={{uri: img.uri}} style={styles.thumbnail} />
              ))}
            </ScrollView>
            {/* Add Memo Input */}
            <TextInput
              style={styles.memoInput}
              placeholder="Additional damage notes for the shop..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              value={formData.damageDescription}
              onChangeText={text => setFormData(prev => ({
                ...prev,
                damageDescription: text
              }))}
            />
          </>
      );

      case 5: return renderInsuranceDetails();
      case 6: return renderPoliceReport();
    }
  };

  return (
    <ImageBackground source={require('../images/front-shop.jpg')} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Estimate Request</Text>
        <Text style={styles.stepCounter}>Step {step} of 6</Text>

        <ScrollView style={styles.formBody}>
          {renderStep()}
        </ScrollView>

        <View style={styles.buttonRow}>
  {step > 1 && (
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={() => {

        resetStepFields(step, 'back'); // Clear current step fields when going back
        setStep(prev => prev - 1);
      }}
    >
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
  )}
  {step === 4 ? (
    <TouchableOpacity 
      style={[styles.submitButton, images.length < 4 && styles.disabledButton]} 
      onPress={handleSubmit}
      disabled={images.length < 4}
    >
      <Text style={styles.buttonText}>Submit Estimate</Text>
    </TouchableOpacity>
  ) : step < 6 ? (
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={() => {
        resetStepFields(step, 'next'); // Clear current step fields when moving forward
        if (step === 3 && formData.paymentMethod === 'insurance') {
          setShowInsuranceModal(true);
        } else {
          setStep(prev => prev + 1);
        }
      }}
      disabled={step === 3 && !formData.paymentMethod}
    >
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Submit Estimate</Text>
    </TouchableOpacity>
  )}
</View>
</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoInput: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#ff4444',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333',
    fontSize: 16,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  stepCounter: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  step3Container: {
    backgroundColor: 'rgba(211, 211, 211, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  damageTitle: {
    fontSize: 24,
    color: 'white',
    textShadowColor: 'red',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 15,
  },
  damageNote: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  picker: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  uploadButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: 'light grey',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emergencyButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  emergencyText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successBanner: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insuranceModal: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ff4444',
    marginLeft: 10,
  },
  checked: {
    backgroundColor: '#ff4444',
  },
  faultContainer: {
    marginBottom: 15,
  },
  faultLabel: {
    color: '#fff',
    marginBottom: 10,
  },
  faultOption: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedFault: {
    backgroundColor: '#ff4444',
  },
  faultText: {
    color: '#fff',
  },
});

export default EstimateScreen;