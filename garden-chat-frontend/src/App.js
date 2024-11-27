// src/App.js
import React from 'react';                         // Import React to use JSX and React features
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import components from react-router-dom for routing
import LoginPage from './components/LoginPage';    // Import LoginPage component for login route
import RegisterPage from './components/RegisterPage';  // Import RegisterPage component for register route
import ChatPage from './components/ChatPage';      // Import ChatPage component for chat route
import "./App.css";                               // Import custom CSS for styling the app

function App() {
    return (// Wrap the app inside Router component to enable routing
        // Define the routes for different paths
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />  {/* Define route for '/login' path to render LoginPage */}
                <Route path="/register" element={<RegisterPage />} />  {/* Define route for '/register' path to render RegisterPage */}
                <Route path="/chat" element={<ChatPage />} />  {/* Define route for '/chat' path to render ChatPage */}
                <Route path="/" element={<LoginPage />} />  {/* Default route ('/') redirects to LoginPage */}
            </Routes>
        </Router>
    );
}

export default App;  // Export the App component as the default export for use in other parts of the app
