import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const ServicesScreen = ({ isGuest, setIsGuest }) => {
  const [vin, setVin] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [additionalData, setAdditionalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSubmodel, setSelectedSubmodel] = useState(null);

  // Fetch dropdown options
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('https://carapi.app/api/years');
        setYears(response.data.map((year) => ({ label: year.toString(), value: year })));
      } catch (err) {
        console.error('Error fetching years:', err);
      }
    };
    fetchYears();
  }, []);
  

  useEffect(() => {
    const fetchMakes = async () => {
      if (!selectedYear) return;
      try {
        const response = await axios.get(`https://carapi.app/api/makes?year=${selectedYear}`);
        setMakes(response.data.map((make) => ({ label: make.name.toString(), value: make.id })));
      } catch (err) {
        console.error('Error fetching makes:', err);
      }
    };
    fetchMakes();
  }, [selectedYear]);
  
  useEffect(() => {
    const fetchMakes = async () => {
      if (!selectedYear) return;
      try {
        const response = await axios.get(`https://carapi.app/api/makes?year=${selectedYear}`);
        setMakes(response.data.map((make) => ({ label: make.name.toString(), value: make.id })));
      } catch (err) {
        console.error('Error fetching makes:', err);
      }
    };
    fetchMakes();
  }, [selectedYear]);
  
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) return;
      try {
        const response = await axios.get(`https://carapi.app/api/models?make=${selectedMake}`);
        setModels(response.data.map((model) => ({ label: model.name.toString(), value: model.id })));
      } catch (err) {
        console.error('Error fetching models:', err);
      }
    };
    fetchModels();
  }, [selectedMake]);
  
  useEffect(() => {
    const fetchSubmodels = async () => {
      if (!selectedModel) return;
      try {
        const response = await axios.get(`https://carapi.app/api/submodels?model=${selectedModel}`);
        setSubmodels(response.data.map((submodel) => ({ label: submodel.name.toString(), value: submodel.id })));
      } catch (err) {
        console.error('Error fetching submodels:', err);
      }
    };
    fetchSubmodels();
  }, [selectedModel]);
  

  // Handle Search
  const handleLookup = async () => {
    if (!vin && (!selectedYear || !selectedMake || !selectedModel || !selectedSubmodel)) {
      setError('Please provide a VIN or select Year, Make, Model, and Submodel');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (vin) {
        // VIN-based lookup
        const vinResponse = await axios.get(`https://carapi.app/api/vin/${vin}?verbose=yes`);
        setVehicleData(vinResponse.data);
      } else {
        // Dropdown-based lookup
        const attributesResponse = await axios.get(
          `https://carapi.app/api/vehicle-attributes?year=${selectedYear}&make=${selectedMake}&model=${selectedModel}&submodel=${selectedSubmodel}`
        );
        setVehicleData(attributesResponse.data);
      }
    } catch (err) {
      setError('Error fetching vehicle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vehicle Information Lookup</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter VIN"
        value={vin}
        onChangeText={setVin}
      />

      <Text style={styles.orText}>OR</Text>

      <RNPickerSelect
        onValueChange={(value) => setSelectedYear(value)}
        items={years}
        placeholder={{ label: 'Select Year', value: null }}
        style={pickerSelectStyles}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedMake(value)}
        items={makes}
        placeholder={{ label: 'Select Make', value: null }}
        style={pickerSelectStyles}
        disabled={!selectedYear}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedModel(value)}
        items={models}
        placeholder={{ label: 'Select Model', value: null }}
        style={pickerSelectStyles}
        disabled={!selectedMake}
      />
      <RNPickerSelect
        onValueChange={(value) => setSelectedSubmodel(value)}
        items={submodels}
        placeholder={{ label: 'Select Submodel', value: null }}
        style={pickerSelectStyles}
        disabled={!selectedModel}
      />

      <Button title="Lookup Vehicle" onPress={handleLookup} />
      
      {loading && <ActivityIndicator size="large" color="#fff" />}

      {error && <Text style={styles.error}>{error}</Text>}

      {vehicleData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Vehicle Information</Text>
          <Text style={styles.resultText}>Make: {vehicleData.make || 'N/A'}</Text>
          <Text style={styles.resultText}>Model: {vehicleData.model || 'N/A'}</Text>
          <Text style={styles.resultText}>Year: {vehicleData.year || 'N/A'}</Text>
          <Text style={styles.resultText}>VIN: {vehicleData.vin || 'N/A'}</Text>
        </View>
      )}
    </ScrollView>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
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
  },
  error: {
    color: 'red',
    marginTop: 10,
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
  },
  resultText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
});

export default ServicesScreen;
