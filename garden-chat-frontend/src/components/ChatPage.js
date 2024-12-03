// src/components/ChatPage.js

// Import necessary dependencies from React, router, and services
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../services/WebSocketService'; // WebSocket service for connections and messaging
import Sidebar from './Sidebar'; // Sidebar for chat groups and online users
import Profile from './Profile'; // Profile component for user info
<<<<<<< HEAD

=======
>>>>>>> b86cc1f1355f0f06de7269ee6fd39a0177d5bb39

function ChatPage() {
    // State hooks for managing chat data
    const [messages, setMessages] = useState([]); // Stores all chat messages
    const [newMessage, setNewMessage] = useState(''); // Message being typed
    const [selectedGroup, setSelectedGroup] = useState('general'); // Current chat group
    const [onlineUsers, setOnlineUsers] = useState([]); // List of online users
    const [groups, setGroups] = useState(['general', 'gardening-tips', 'plant-care']); // Chat groups
    const [typingMessage, setTypingMessage] = useState(''); // Displayed typing indicator
    const [errorMessage, setErrorMessage] = useState(null); // Connection error message

    // Retrieve the username from localStorage
    const username = localStorage.getItem('username');
    const navigate = useNavigate(); // Hook to programmatically navigate between routes

    // Redirect to login if no username is found
    useEffect(() => {
        if (!username) {
            console.error("[ChatPage Error] Username not found. Redirecting to login...");
            navigate('/login');
        }
    }, [username, navigate]);

    // Connect WebSocket and handle subscriptions
    useEffect(() => {
        if (!username) return; // Prevent WebSocket connection without a valid username

        const notificationSound = new Audio('/notification.mp3'); // Sound for new messages
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || []; // Retrieve stored messages
<<<<<<< HEAD
        const filteredMessages = savedMessages.filter(msg => msg.group === selectedGroup);
        setMessages(filteredMessages); // Initialize state with stored messages

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => {
                const allMessages = JSON.parse(localStorage.getItem('messages')) || [];
                const updatedMessages = [...prevMessages, message];

                if (message.group === selectedGroup) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }

=======
        setMessages(savedMessages); // Initialize state with stored messages

        const handleNewMessage = (message) => {
            if (message.group === selectedGroup) {
                const updatedMessages = [...messages, message];
                setMessages(updatedMessages); // Update messages state
>>>>>>> b86cc1f1355f0f06de7269ee6fd39a0177d5bb39
                localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Persist messages
                if (message.sender !== username) {
                    notificationSound.play(); // Play sound for new messages
                }
<<<<<<< HEAD
                return updatedMessages;
            });
        };

        const handleUserUpdates = (users) => {
            setOnlineUsers(users); // Update the online users state
=======
            }
        };

        const handleUserUpdates = (users) => {
            setOnlineUsers(users); // Update online users
>>>>>>> b86cc1f1355f0f06de7269ee6fd39a0177d5bb39
        };

        try {
            WebSocketService.connect(handleNewMessage, handleUserUpdates); // Connect WebSocket
            WebSocketService.sendUserPresence(username); // Notify server of the user's presence
        } catch (error) {
            console.error("[ChatPage Error] WebSocket connection failed:", error);
            setErrorMessage("Connection lost. Trying to reconnect...");
        }

        // Cleanup on unmount
        return () => {
            WebSocketService.disconnect();
        };
    }, [selectedGroup, username]);

    // Handle typing status and notifications
    useEffect(() => {
        WebSocketService.onTyping((user) => {
            if (user !== username) {
                setTypingMessage(`${user} is typing...`);
            }
        });

        const typingTimeout = setTimeout(() => setTypingMessage(''), 3000); // Clear typing indicator after 3 seconds
        return () => clearTimeout(typingTimeout);
    }, [username]);

    // Send typing status when the user types
    const handleTyping = (e) => {
        setNewMessage(e.target.value); // Update the input field
        if (e.target.value.trim()) {
            WebSocketService.sendTypingStatus(username, selectedGroup); // Notify others
        }
    };

    // Send a new message
    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                sender: username,
                content: newMessage,
                group: selectedGroup,
            };
            WebSocketService.sendMessage(message); // Send message to server
            setNewMessage(''); // Clear input
        }
    };

    // Add a new group
    const createGroup = (groupName) => {
        if (!groups.includes(groupName) && groupName.trim()) {
            setGroups([...groups, groupName]); // Add group
            setSelectedGroup(groupName); // Switch to new group
        }
    };

    // Render the chat interface
    return (
        <div className="chat-page">
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display errors */}
            <Sidebar
                groups={groups}
                selectGroup={setSelectedGroup}
                onlineUsers={onlineUsers}
                createGroup={createGroup}
            />
            <div className="chat-section">
                <Profile username={username} />
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <p><strong>{msg.sender}:</strong> {msg.content}</p>
                        </div>
                    ))}
                    {typingMessage && <div className="typing-indicator">{typingMessage}</div>}
                </div>
                <div className="input-bar">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={handleTyping}
<<<<<<< HEAD
                        style={{ height: 'auto', maxHeight: '100px', overflowY: 'auto' }}
=======
>>>>>>> b86cc1f1355f0f06de7269ee6fd39a0177d5bb39
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage; // Export component for use in other parts of the app
