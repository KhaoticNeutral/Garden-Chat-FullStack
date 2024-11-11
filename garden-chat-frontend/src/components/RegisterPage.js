// src/components/RegisterPage.js

// Import necessary dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Hook to programmatically navigate between routes
import axios from '../utils/axiosConfig'; // Configured Axios instance for API requests

function RegisterPage() {
    const navigate = useNavigate();  // Initialize navigation function for redirecting user
    // State hooks for managing registration form inputs, error messages, and loading state
    const [username, setUsername] = useState(''); // Stores the entered username
    const [password, setPassword] = useState(''); // Stores the entered password
    const [error, setError] = useState(null); // Stores error messages to display to the user
    const [loading, setLoading] = useState(false); // Indicates if the registration request is in progress

    // Function to handle form submission and registration
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior
        setLoading(true); // Sets loading state to true while registration request is in progress
        setError(null); // Clears any previous error messages

        try {
            // Sends a POST request to the registration endpoint with username and password
            const response = await axios.post('/users/register', { username, password });
            if (response.status === 200) {
                // If registration is successful, alert the user and navigate to the login page
                alert("Registration successful! You can now log in.");
                navigate('/login'); // Redirects to login page upon successful registration
            }
        } catch (error) {
            // If there’s an error during registration, display an error message
            setError(error.response?.data || 'Registration failed. Please try again.');
        } finally {
            setLoading(false); // Resets loading state after request completes
        }
    };

    // Render registration form with error messages and loading indicators
    return (
        <div className="register-page">
            <h2>Register for Garden Chat</h2> {/* Page title */}
            <form onSubmit={handleRegister}>
                {error && <div className="error-message">{error}</div>} {/* Display error if any */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                    required // Makes the input field required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    required // Makes the input field required
                />
                <button type="submit" disabled={loading}> {/* Button is disabled while loading */}
                    {loading ? 'Registering...' : 'Register'} {/* Show "Registering..." text if loading */}
                </button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p> {/* Link to login page for existing users */}
        </div>
    );
}

export default RegisterPage; // Export component for use in other parts of the app
