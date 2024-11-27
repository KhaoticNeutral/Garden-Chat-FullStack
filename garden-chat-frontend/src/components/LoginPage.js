// src/components/LoginPage.js

// Import necessary dependencies from React, router, and authentication context
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Custom authentication hook for managing login state
import axios from '../utils/axiosConfig'; // Configured Axios instance for API requests
import WebSocketService from '../services/WebSocketService';

function LoginPage() {
    // State hooks for managing login form inputs, error messages, and loading state
    const [username, setUsername] = useState(''); // Stores the entered username
    const [password, setPassword] = useState(''); // Stores the entered password
    const [error, setError] = useState(null); // Stores error messages to display to the user
    const [loading, setLoading] = useState(false); // Indicates if the login request is in progress

    // Get login function from authentication context and router's navigation function
    const { login } = useAuth(); // login function for setting user session
    const navigate = useNavigate(); // Router function to programmatically navigate between routes

    // Function to handle form submission and login
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior
        setLoading(true); // Sets loading state to true while login request is in progress
        setError(null); // Clears any previous error messages

        try {
            // Sends a POST request to the login endpoint with username and password
            const response = await axios.post('/users/login', { username, password });
            if (response.data.token) {
                // If login is successful and a token is received
                login(username, response.data.token); // Saves the token and username in context
                WebSocketService.connect(); // Connect to WebSocket after successful login
                navigate('/chat'); // Redirects to chat page upon successful login
            } else {
                // If the response does not contain a token, display an error message
                setError("Login failed. Invalid response from server.");
            }
        } catch (err) {
            // If there’s an error during the request, display a generic error message
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false); // Resets loading state after request completes
        }
    };

    // Render login form with error messages and loading indicators
    return (
        <div className="login-page">
            <h2>Login to Garden Chat</h2> {/* Page title */}
            {error && <div className="error-message">{error}</div>} {/* Display error if any */}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                    placeholder="Username"
                    required // Makes the input field required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    placeholder="Password"
                    required // Makes the input field required
                />
                <button type="submit" disabled={loading}> {/* Button is disabled while loading */}
                    {loading ? 'Logging in...' : 'Login'} {/* Show "Logging in..." text if loading */}
                </button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p> {/* Link to registration page */}
        </div>
    );
}

export default LoginPage; // Export component for use in other parts of the app
