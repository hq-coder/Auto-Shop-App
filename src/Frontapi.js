import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.230:3000';




const Frontapi = {
  loginUser: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data);
      return response.data; // Returns the user and message
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  registerUser: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, data);
      return response.data; // Returns success message or user details
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default Frontapi;
