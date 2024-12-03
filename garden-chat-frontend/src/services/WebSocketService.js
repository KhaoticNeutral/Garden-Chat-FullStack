// src/services/WebSocketService.js
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.typingCallback = null;
        this.reconnectDelay = 5000; // Delay in ms for automatic reconnection
    }

    async connect(onMessageReceived, onUsersUpdated) {
        if (this.isConnected) {
            console.log("[STOMP Info] Already connected to WebSocket.");
            return;
        }

        console.log("[STOMP Debug] Initiating WebSocket connection...");
        const socketFactory = () => new SockJS('http://localhost:8088/ws');
        this.stompClient = Stomp.over(socketFactory);

        // Configure heartbeats
        this.stompClient.heartbeatIncoming = 10000; // Expect a heartbeat from the server every 10 seconds
        this.stompClient.heartbeatOutgoing = 10000; // Send a heartbeat to the server every 10 seconds

        // Add debug logs for STOMP lifecycle
        this.stompClient.debug = (str) => console.log(`[STOMP Debug] ${str}`);
        this.stompClient.onStompError = (frame) => {
            console.error("[STOMP Error] Broker error:", frame.headers['message']);
        };

        // Attempt connection with a fallback timeout
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.warn("[STOMP Warning] Connection timeout, proceeding without STOMP.");
                resolve(); // Proceed even if STOMP fails
            }, 5000); // 5-second fallback

            this.stompClient.connect({}, (frame) => {
                clearTimeout(timeout); // Clear fallback timeout
                console.log("[STOMP Connected] Frame received:", frame);
                this.isConnected = true;

                // Set up subscriptions if necessary
                this._setupSubscriptions(onMessageReceived, onUsersUpdated);
                resolve();
            }, (error) => {
                clearTimeout(timeout); // Clear timeout on error
                console.error("[STOMP Error] Connection failed:", error);
                reject(error);
            });
        });
    }

    _setupSubscriptions(onMessageReceived, onUsersUpdated) {
        if (this.stompClient && this.stompClient.connected) {
            console.log("[STOMP Info] Setting up subscriptions...");
    
            // Subscribe to messages
            this.stompClient.subscribe('/topic/messages', (message) => {
                console.log("[STOMP Debug] Message received:", message);
                onMessageReceived(JSON.parse(message.body));
            });
    
            // Subscribe to online users
            this.stompClient.subscribe('/topic/online-users', (users) => {
                console.log("[STOMP Debug] Online users updated:", users);
                if (onUsersUpdated) {
                    onUsersUpdated(JSON.parse(users.body));
                }
            });
    
            // Subscribe to typing notifications
            this.stompClient.subscribe('/topic/typing', (typingStatus) => {
                console.log("[STOMP Debug] Typing status received:", typingStatus);
                if (this.typingCallback) {
                    const { username } = JSON.parse(typingStatus.body);
                    this.typingCallback(username);
                }
            });
    
            console.log("[STOMP Info] Subscriptions successfully set up.");
        } else {
            console.error("[STOMP Warning] STOMP client not connected. Retrying subscriptions...");
            setTimeout(() => this._setupSubscriptions(onMessageReceived, onUsersUpdated), 1000); // Retry after 1 second
        }
    }

    // Set the callback for typing notifications
    onTyping(callback) {
        this.typingCallback = callback; // Assign the provided callback to typingCallback
        console.log("[STOMP Info] Typing callback set.");
    }

    // Send typing status to the server for a specific group
    sendTypingStatus(username, group) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/typing',
                body: JSON.stringify({ username, group }),
            });
            console.log("[STOMP Info] Sent typing status for user:", username);
        } else {
            console.error("[STOMP Warning] Cannot send typing status. STOMP client not connected.");
        }
    }

    // Send a chat message to the server
    sendMessage(message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/chat',
                body: JSON.stringify(message),
            });
            console.log("[STOMP Info] Message sent:", message);
        } else {
            console.error("[STOMP Warning] Cannot send message. STOMP client not connected.");
        }
    }

    // Notify server of user's presence (to mark as online)
    sendUserPresence(username) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.publish({
                destination: '/app/online',
                body: JSON.stringify({ username }),
            });
            console.log("[STOMP Info] User presence sent for:", username);
        } else {
            console.error("[STOMP Warning] Cannot send user presence. STOMP client not connected.");
        }
    }

    // Disconnect the WebSocket client
    disconnect() {
        if (this.isConnected) {
            console.log("[STOMP Debug] Disconnecting WebSocket...");
            this.stompClient.deactivate(); // Gracefully close the connection
            this.isConnected = false; // Reset connection state
        } else {
            console.log("[STOMP Info] WebSocket already disconnected.");
        }
    }
}

export default new WebSocketService();