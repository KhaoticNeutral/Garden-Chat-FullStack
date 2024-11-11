// src/components/ChatPage.js

// Import necessary dependencies from React, router, and services
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../services/WebSocketService'; // Custom WebSocket service for managing connections and messaging
import Sidebar from './Sidebar'; // Sidebar component for displaying chat groups and online users
import Profile from './Profile'; // Profile component to show the user's profile info

function ChatPage() {
    // State hooks for managing chat data
    const [messages, setMessages] = useState([]); // Stores all chat messages
    const [newMessage, setNewMessage] = useState(''); // Stores the message currently being typed
    const [selectedGroup, setSelectedGroup] = useState('general'); // Stores the currently selected group
    const [onlineUsers, setOnlineUsers] = useState([]); // Stores the list of online users
    const [groups, setGroups] = useState(['general', 'gardening-tips', 'plant-care']); // List of chat groups
    const [typing, setTyping] = useState(false); // Indicates whether the user is currently typing
    const [typingMessage, setTypingMessage] = useState(''); // Message to display when another user is typing
    const [errorMessage, setErrorMessage] = useState(null); // Stores error messages (e.g., connection issues)

    // Retrieve the username from local storage
    const username = localStorage.getItem('username');
    const navigate = useNavigate(); // Hook to programmatically navigate between routes

    // Redirect to login if no username is found
    useEffect(() => {
        if (!username) {
            navigate('/login');
        }
    }, [username, navigate]);

    // Function to add a new group to the list of groups
    const createGroup = (groupName) => {
        if (!groups.includes(groupName) && groupName.trim()) {
            setGroups([...groups, groupName]); // Add the new group to the groups array
            setSelectedGroup(groupName); // Automatically switch to the new group
        }
    };

    // Initialize messages, connect WebSocket, and handle new messages and user presence
    useEffect(() => {
        const notificationSound = new Audio('/notification.mp3'); // Audio alert for new messages
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || []; // Retrieve stored messages
        setMessages(savedMessages); // Set messages from local storage if any exist

        try {
            // Connect WebSocket and set up message handler
            WebSocketService.connect(
                (message) => {
                    // Only add the message if it's for the selected group
                    if (message.group === selectedGroup) {
                        const updatedMessages = [...messages, message];
                        setMessages(updatedMessages); // Update messages state
                        localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Persist messages
                        if (message.sender !== username) {
                            notificationSound.play(); // Play notification sound for messages from others
                        }
                    }
                },
                (users) => setOnlineUsers(users) // Update online users list
            );

            WebSocketService.sendUserPresence(username); // Notify server of the user's presence
        } catch (error) {
            console.error('WebSocket connection error:', error); // Log connection errors
            setErrorMessage("Connection lost. Trying to reconnect..."); // Display error message
        }

        return () => WebSocketService.disconnect(); // Disconnect WebSocket on cleanup
    }, [selectedGroup, username, messages]);

    // Handle typing status and send updates
    const handleTyping = (e) => {
        setNewMessage(e.target.value); // Update the message being typed
        if (!typing) {
            setTyping(true); // Indicate that user started typing
            WebSocketService.sendTypingStatus(username, selectedGroup); // Notify others in the group
        }
    };

    // Handle typing notifications from other users
    useEffect(() => {
        WebSocketService.onTyping((user) => {
            setTypingMessage(`${user} is typing...`); // Display who is typing
        });

        const typingTimeout = setTimeout(() => setTypingMessage(''), 3000); // Clear typing message after 3 seconds
        return () => clearTimeout(typingTimeout); // Clear timeout on cleanup
    }, []);

    // Send a new message and clear the input field
    const sendMessage = () => {
        if (newMessage.trim()) { // Ensure message is not empty
            const message = {
                sender: username,
                content: newMessage,
                group: selectedGroup,
            };
            WebSocketService.sendMessage(message); // Send message via WebSocket
            setNewMessage(''); // Clear the message input
            setTyping(false); // Reset typing status
        }
    };

    // Render chat interface
    return (
        <div className="chat-page">
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Show error message if any */}
            <Sidebar
                groups={groups}
                selectGroup={setSelectedGroup}
                onlineUsers={onlineUsers}
                createGroup={createGroup}
            /> {/* Sidebar for group selection and user management */}
            <div className="chat-section">
                <Profile username={username} /> {/* Displays user's profile */}
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <p><strong>{msg.sender}:</strong> {msg.content}</p> {/* Display each message */}
                        </div>
                    ))}
                    {typingMessage && <div className="typing-indicator">{typingMessage}</div>} {/* Display typing indicator */}
                </div>
                <div className="input-bar">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={handleTyping} // Trigger typing events on change
                    />
                    <button onClick={sendMessage}>Send</button> {/* Button to send message */}
                </div>
            </div>
        </div>
    );
}

export default ChatPage; // Export component for use in other parts of the app
