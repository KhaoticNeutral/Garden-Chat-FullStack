// src/components/Profile.js

// Import necessary dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Hook to programmatically navigate between routes

function Profile({ username }) { // Component that takes in the username as a prop
    const navigate = useNavigate();  // Initialize navigation function for redirecting user

    // Function to handle logout logic
    const handleLogout = () => {
        // Remove stored items from localStorage to log the user out
        localStorage.removeItem('token'); // Removes the authentication token
        localStorage.removeItem('username'); // Removes the username
        localStorage.removeItem('messages'); // Removes stored messages

        // Redirect to login page after logout
        navigate('/login'); // Programmatically navigates the user to the login page
    };

    // Render the profile section
    return (
        <div className="profile">
            <img
                src="https://images.app.goo.gl/U8d63XzCsSiJALZW8" // Profile picture URL
                alt="Profile"
                className="profile-pic" // CSS class for styling the profile picture
            />
            <div>
                <p>{username}</p> {/* Display the username passed in as a prop */}
                <button onClick={handleLogout} className="logout-btn">Logout</button> {/* Logout button with onClick handler */}
            </div>
        </div>
    );
}

export default Profile; // Export the component for use in other parts of the app
