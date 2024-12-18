// src/utils/axiosConfig.js
import axios from 'axios'; // Import the Axios library for making HTTP requests

// Create an Axios instance with default configuration
const instance = axios.create({
    // Base URL for the backend API; all requests will be prefixed with this URL
    baseURL: 'http://localhost:8088/api',
    withCredentials: true, // Allow cookies if needed
    // Default headers for all requests sent by this Axios instance
});

// Axios request interceptor to attach the authentication token to headers
instance.interceptors.request.use((config) => {
    // Retrieve the token from localStorage (if present)
    const token = localStorage.getItem('token');

    // If a token is found, add it to the Authorization header of the request
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Only set JSON content type for API requests
    if (!config.url.endsWith('.css') && !config.url.endsWith('.js')) {
        config.headers['Content-Type'] = 'application/json';
    }
    // Return the modified config to proceed with the request
    return config;
});

// Export the configured Axios instance for use in API calls across the app
export default instance;
