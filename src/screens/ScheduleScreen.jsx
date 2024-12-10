import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ScrollView, ProgressBarAndroid } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ScheduleScreen = ({ isGuest, setIsGuest }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([
    { id: '1', date: '2024-12-10', time: '10:00 AM', service: 'Oil Change' },
    { id: '2', date: '2024-12-10', time: '12:30 PM', service: 'Tire Rotation' },
    { id: '3', date: '2024-12-12', time: '3:00 PM', service: 'Brake Inspection' },
  ]);
  const [vehicleProgress, setVehicleProgress] = useState(0.6); // Example: 60% completed

  const [newAppointment, setNewAppointment] = useState({
    time: '',
    service: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Select a Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle adding a new appointment
  const handleAddAppointment = () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date first.');
      return;
    }
    if (!newAppointment.time || !newAppointment.service) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setAppointments((prevAppointments) => [
      ...prevAppointments,
      {
        id: (prevAppointments.length + 1).toString(),
        date: selectedDate,
        time: newAppointment.time,
        service: newAppointment.service,
      },
    ]);

    // Reset form and error message
    setNewAppointment({ time: '', service: '' });
    setErrorMessage('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Month and Year Display */}
      <Text style={styles.header}>{formatDate(selectedDate)}</Text>

      {/* Calendar */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'red' },
        }}
        theme={{
          calendarBackground: '#333',
          textSectionTitleColor: '#fff',
          dayTextColor: '#fff',
          todayTextColor: 'red',
          selectedDayBackgroundColor: 'red',
          selectedDayTextColor: '#fff',
        }}
        style={styles.calendar}
      />

      {/* Appointments List */}
      <Text style={styles.subHeader}>Appointments:</Text>
      <FlatList
        data={appointments.filter((appointment) => appointment.date === selectedDate)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointment}>
            <Text style={styles.appointmentText}>
              {item.time} - {item.service}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noAppointmentsText}>No appointments for this date.</Text>
        }
      />

      {/* Appointment Form */}
      <Text style={styles.subHeader}>Schedule an Appointment:</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Time (e.g., 10:00 AM)"
          placeholderTextColor="#888"
          value={newAppointment.time}
          onChangeText={(text) => setNewAppointment((prev) => ({ ...prev, time: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Service (e.g., Oil Change)"
          placeholderTextColor="#888"
          value={newAppointment.service}
          onChangeText={(text) => setNewAppointment((prev) => ({ ...prev, service: text }))}
        />
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        <Button title="Add Appointment" onPress={handleAddAppointment} color="red" />
      </View>

      {/* Vehicle Progress Bar */}
      <Text style={styles.subHeader}>Vehicle Service Progress:</Text>
      <View style={styles.progressContainer}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={vehicleProgress}
          color="red"
        />
        <Text style={styles.progressText}>{Math.round(vehicleProgress * 100)}% Completed</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  appointment: {
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  appointmentText: {
    color: '#fff',
    fontSize: 16,
  },
  noAppointmentsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  form: {
    marginTop: 10,
    marginBottom: 20,
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
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    marginTop: 5,
  },
});

export default ScheduleScreen;
