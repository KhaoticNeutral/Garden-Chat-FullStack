// src/services/WebSocketService.js
import { Stomp } from '@stomp/stompjs';    // Import Stomp client library
import SockJS from 'sockjs-client';        // Import SockJS for WebSocket fallback support

// Define the WebSocket endpoint URL (adjustable based on backend server location)
// const URL = 'http://localhost:8088/ws';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.typingCallback = null;
        this.isConnected = false;
        this.reconnectDelay = 5000;  // Customizable reconnect delay
    }

    async connect(onMessageReceived, onUsersUpdated) {
        if (this.isConnected) {
            console.log("Already connected to WebSocket.");
            return;
        }

        try {
            const socketFactory = () => new SockJS('http://localhost:8088/ws');
            this.stompClient = Stomp.over(socketFactory);
            
            await new Promise((resolve, reject) => {
                this.stompClient.connect({}, (frame) => {
                    console.log('Connected: ' + frame);
                    this.isConnected = true;
                    this._setupSubscriptions(onMessageReceived, onUsersUpdated);
                    resolve(frame);
                }, (error) => {
                    console.error("STOMP connection error: ", error);
                    reject(error);
                });
            });

            this.stompClient.reconnectDelay = this.reconnectDelay;
            this.stompClient.debug = (str) => console.log(str);

            this.stompClient.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            };

        } catch (error) {
            console.error("Connection failed, will retry in " + this.reconnectDelay + "ms.");
            setTimeout(() => this.connect(onMessageReceived, onUsersUpdated), this.reconnectDelay);
        }
    }

    // Set up actions to be taken once the connection is successful
    _setupSubscriptions(onMessageReceived, onUsersUpdated) {
        // Subscribe to messages topic to receive chat messages
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
    }

    // Set up the callback function for typing notifications
    onTyping(callback) {
        this.typingCallback = callback; // Assign the provided callback to typingCallback
    }

    // Send typing status to the server for a specific group
    sendTypingStatus(username, group) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/typing',
                body: JSON.stringify({ username, group })
            });
        }
    }

    // Send a chat message to the server
    sendMessage(message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(message)
            });
        }
    }

    // Notify server of user's presence (to mark as online)
    sendUserPresence(username) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/online',
                body: JSON.stringify({ username })
            });
        }
    }

    // Disconnect the WebSocket client
    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate(); // Properly close the connection
            this.isConnected = false;  // Reset connection state
        }
    }
}

// Export a singleton instance of WebSocketService to be used across the app
export default new WebSocketService();