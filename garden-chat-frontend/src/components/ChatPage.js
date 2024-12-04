// src/components/ChatPage.js
// Import necessary dependencies from React, router, and services
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../services/WebSocketService'; // WebSocket service for connections and messaging
import Sidebar from './Sidebar'; // Sidebar for chat groups and online users
import Profile from './Profile'; // Profile component for user info

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

    // Handle new message updates
    const handleNewMessage = (message) => {
        console.log("[ChatPage Debug] handleNewMessage invoked with:", message);

        if (!message.group) {
            console.error("[ChatPage Error] Received message without a valid group:", message);
            return;
        }

        // Log the incoming message for debugging
        console.log(`[ChatPage Debug] Received message for group ${message.group}:`, message);

        // Check and update local storage
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
        const updatedGroupMessages = savedMessages[message.group] || [];

        // Add the new message to the correct group's messages
        updatedGroupMessages.push(message);

        const updatedMessages = { ...savedMessages, [message.group]: updatedGroupMessages };
        localStorage.setItem('messages', JSON.stringify(updatedMessages));

        // Update the `messages` state if the message is for the selected group
        if (message.group === selectedGroup) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    // Connect WebSocket and handle general subscriptions
    useEffect(() => {
        if (!username) return; // Ensure username exists before proceeding

        const notificationSound = new Audio('/notification.mp3');

        // Initialize messages for the selected group
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
        const channelMessages = savedMessages[selectedGroup] || [];
        setMessages(channelMessages);

        // Handle new message updates
        const handleNewMessage = (message) => {
            if (!message.group) {
                console.error("[ChatPage Error] Received message without a valid group:", message);
                return;
            }

            // Log the incoming message for debugging
            console.log(`[ChatPage Debug] Received message for group ${message.group}:`, message);

            const savedMessages = JSON.parse(localStorage.getItem('messages')) || {};
            const updatedGroupMessages = savedMessages[message.group] || [];
            updatedGroupMessages.push(message);

            const updatedMessages = { ...savedMessages, [message.group]: updatedGroupMessages };
            localStorage.setItem('messages', JSON.stringify(updatedMessages));

            if (message.group === selectedGroup) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        WebSocketService.subscribeToGroupMessages(selectedGroup, (message) => {
            console.log(`[ChatPage Debug] Received message for group ${selectedGroup}:`, message);
            handleNewMessage(message); // Your function in ChatPage
        });

        const handleUserUpdates = (users) => setOnlineUsers(users);

        try {
            WebSocketService.connectWithRetry(handleNewMessage, handleUserUpdates)
                .then(() => {
                    if (groups.includes(selectedGroup)) {
                        WebSocketService.subscribeToGroupMessages(selectedGroup, handleNewMessage);
                        WebSocketService.sendUserPresence(username);
                    } else {
                        console.warn(`[ChatPage] Invalid selectedGroup: ${selectedGroup}`);
                    }
                })
                .catch((error) => {
                    console.error("[ChatPage Error] WebSocket connection failed:", error);
                    setErrorMessage("Connection lost. Trying to reconnect...");
                });
        } catch (error) {
            console.error("[ChatPage Error] Unexpected error:", error);
        }

        return () => {
            if (selectedGroup && groups.includes(selectedGroup)) {
                WebSocketService.unsubscribeFromGroupMessages(selectedGroup);
            } else {
                console.warn(`[ChatPage] Skipping unsubscribe for invalid group '${selectedGroup}'.`);
            }
        };
    }, [selectedGroup, username, groups]);

    // Subscribe and unsubscribe to group messages
    useEffect(() => {
        if (!selectedGroup || !groups.includes(selectedGroup)) {
            console.warn(`[ChatPage] Invalid group selected: ${selectedGroup}`);
            return;
        }

        const handleTypingNotification = (user) => {
            console.log(`[ChatPage Debug] Typing notification received for group: ${selectedGroup}, User: ${user}`);
            if (user !== username) {
                setTypingMessage(`${user} is typing...`);
                setTimeout(() => setTypingMessage(''), 3000);
            }
        };

        const trySubscribeToTypingNotifications = async () => {
            if (WebSocketService.isConnected) {
                WebSocketService.subscribeToTypingNotifications(selectedGroup, handleTypingNotification);
            } else {
                console.warn("[ChatPage Warning] WebSocket client not yet connected. Retrying subscription...");
                setTimeout(trySubscribeToTypingNotifications, 1000); // Retry in 1 second
            }
        };

        trySubscribeToTypingNotifications();

        return () => {
            console.log(`[ChatPage Debug] Unsubscribing from typing notifications for group: ${selectedGroup}`);
            WebSocketService.unsubscribeFromGroupMessages(selectedGroup);
        };
    }, [selectedGroup, username, groups]);

    // Typing notifications
    useEffect(() => {
        console.log(`[ChatPage Debug] Subscribing to typing notifications for group: ${selectedGroup}`);
        const typingSubscription = WebSocketService.subscribeToTypingNotifications(selectedGroup, (user) => {
            console.log(`[ChatPage Debug] Typing notification received for group ${selectedGroup}: ${user}`);
            if (user !== username) {
                setTypingMessage(`${user} is typing...`);
                setTimeout(() => setTypingMessage(''), 3000);
            }
        });

        return () => {
            if (typingSubscription) {
                console.log(`[ChatPage Debug] Unsubscribing from typing notifications for group: ${selectedGroup}`);
                typingSubscription.unsubscribe();
            }
        };
    }, [selectedGroup, username, groups]);

    // Send typing status when the user types
    const handleTyping = (e) => {
        setNewMessage(e.target.value); // Update the input field
        if (e.target.value.trim() && selectedGroup) {
            WebSocketService.sendTypingStatus(username, selectedGroup); // Notify others
        }
    };

    // Send a new message
    const sendMessage = () => {
        if (newMessage.trim() && selectedGroup) {
            const message = {
                sender: username,
                content: newMessage,
                group: selectedGroup, // Attach the current group
            };
            console.log(`[ChatPage Debug] Sending message to group ${selectedGroup}:`, message);
            WebSocketService.sendMessageToGroup(selectedGroup, message); // Send message to the selected group
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
                        style={{ height: 'auto', maxHeight: '100px', overflowY: 'auto' }}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
