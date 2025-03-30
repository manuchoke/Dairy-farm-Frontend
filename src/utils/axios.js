import axios from 'axios';

const baseURL = 'https://dairy-farm-server.onrender.com';

const instance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token and log requests
instance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request headers:', config.headers);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and log responses
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      config: error.config
    });

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    // Handle specific error cases
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => `${baseURL}/images/${imagePath}`;

export default instance;