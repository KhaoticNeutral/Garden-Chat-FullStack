// src/services/WebSocketService.js
import { Stomp } from '@stomp/stompjs';    // Import Stomp client library
import SockJS from 'sockjs-client';        // Import SockJS for WebSocket fallback support

// Define the WebSocket endpoint URL (adjustable based on backend server location)
const URL = 'http://localhost:8088/ws';

class WebSocketService {
    constructor() {
        this.stompClient = null;      // Initialize the STOMP client to null
        this.typingCallback = null;    // Initialize callback for typing notifications to null
    }

    // Connect to WebSocket and set up subscription channels
    connect(onMessageReceived, onUsersUpdated) {
        // Create a SockJS instance using the WebSocket URL
        const socketFactory = () => new SockJS(URL);

        // Create a STOMP client using the SockJS instance for WebSocket communication
        this.stompClient = Stomp.over(socketFactory);

        // Set automatic reconnection delay to 5 seconds in case of disconnection
        this.stompClient.reconnectDelay = 5000;

        // Set up actions on successful WebSocket connection
        this.stompClient.onConnect = () => {
            console.log("WebSocket connected");

            // Subscribe to the messages topic to receive chat messages
            this.stompClient.subscribe('/topic/messages', (message) => {
                onMessageReceived(JSON.parse(message.body));  // Invoke the provided callback with the parsed message
            });

            // Subscribe to the online-users topic to get updates on online users
            this.stompClient.subscribe('/topic/online-users', (users) => {
                if (onUsersUpdated) {
                    onUsersUpdated(JSON.parse(users.body));  // Invoke the provided callback with the updated user list
                }
            });

            // Subscribe to typing topic to receive typing notifications
            this.stompClient.subscribe('/topic/typing', (typingStatus) => {
                if (this.typingCallback) {
                    const { username } = JSON.parse(typingStatus.body); // Parse typing status
                    this.typingCallback(username);  // Invoke typing callback with username
                }
            });
        };

        // Handle STOMP errors reported by the message broker
        this.stompClient.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']); // Log broker error message
            console.error('Additional details: ' + frame.body); // Log additional error details
        };

        // Activate the STOMP client to initiate connection
        this.stompClient.activate();
    }

    // Set up the callback function for typing notifications
    onTyping(callback) {
        this.typingCallback = callback; // Assign the provided callback to typingCallback
    }

    // Send typing status to the server for a specific group
    sendTypingStatus(username, group) {
        if (this.stompClient && this.stompClient.connected) {
            // Publish typing status message to the typing topic
            this.stompClient.publish({
                destination: '/app/typing',    // Destination topic for typing notifications
                body: JSON.stringify({ username, group })  // Send the username and group as JSON
            });
        }
    }

    // Send a chat message to the server
    sendMessage(message) {
        if (this.stompClient && this.stompClient.connected) {
            // Publish the message to the chat topic
            this.stompClient.publish({
                destination: '/app/chat',      // Destination topic for chat messages
                body: JSON.stringify(message)  // Send the message content as JSON
            });
        }
    }

    // Notify server of user's presence (to mark as online)
    sendUserPresence(username) {
        if (this.stompClient && this.stompClient.connected) {
            // Publish user presence message to the online topic
            this.stompClient.publish({
                destination: '/app/online',    // Destination topic for online status
                body: JSON.stringify({ username })  // Send username as JSON
            });
        }
    }

    // Disconnect the WebSocket client
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate(); // Properly close the connection
        }
    }
}

// Export a singleton instance of WebSocketService to be used across the app
export default new WebSocketService();
