import axios from 'axios';

// Automatically selects the URL based on your .env file
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Note: If using Create-React-App, use: process.env.REACT_APP_API_URL

const client = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default client;