// src/index.js
import React from 'react';                            // Import React to use JSX and React features
import ReactDOM from 'react-dom/client';               // Import ReactDOM to render the React component tree to the DOM
import { AuthProvider } from './context/AuthProvider'; // Import AuthProvider to wrap the app and manage authentication context
import App from './App';                               // Import the main App component for the application

// Get the root element from the HTML file where the app will be rendered
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);         // Create a root for the React app using React 18's `createRoot`

// Render the React app
root.render(
    <AuthProvider>                                     // Wrap the app with AuthProvider for authentication state management
        <App />                                        // Render the main App component as the root of the app
    </AuthProvider>
);
