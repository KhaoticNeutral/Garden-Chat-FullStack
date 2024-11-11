// src/context/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext, which will hold the authentication state and functions
const AuthContext = createContext();

// AuthProvider component to manage authentication and provide context to children components
export const AuthProvider = ({ children }) => {
    // State for the current user, initialized from localStorage if available
    const [user, setUser] = useState(() => {
        // Check if user data is saved in localStorage to persist login sessions
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Function to log in the user
    const login = (username, token) => {
        // Create user data with username and token
        const userData = { username, token };
        setUser(userData);  // Update state with user data
        // Save user data to localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to log out the user
    const logout = () => {
        setUser(null);  // Clear the user state
        localStorage.removeItem('user');  // Remove user data from localStorage
    };

    // Check if the user is authenticated (if user data is available)
    const isAuthenticated = () => !!user;

    // useEffect to check token validity on initial render
    useEffect(() => {
        // If there's user data but no token, automatically log the user out
        if (user && !user.token) {
            logout();
        }
    }, [user]);  // Depend on `user`, so it re-runs if user state changes

    return (
        // Provide authentication data and functions to all child components
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access AuthContext easily in other components
export const useAuth = () => {
    return useContext(AuthContext);
};
