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
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Login API request
            const response = await axios.post('/users/login', { username, password });
            if (response.data.token) {
                // Save user session
                login(username, response.data.token);
                localStorage.setItem('username', username);

                // Initialize WebSocket
                try {
                    await WebSocketService.connect(() => {}, () => {});
                } catch (wsError) {
                    console.error("[Login Warning] STOMP connection delayed. Proceeding to chat...");
                }

                // Navigate to chat page
                console.log("[Login Success] Navigating to chat page...");
                navigate('/chat');
            } else {
                setError("Login failed. Invalid response from server.");
            }
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
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
