package com.example.gardenchat.controller;

import com.example.gardenchat.model.Message; // Import the Message entity/model
import com.example.gardenchat.repository.MessageRepository; // Import the MessageRepository for data access
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

// Annotates this class as a Spring Controller to handle HTTP requests and WebSocket messages
@Controller
@RequestMapping("/api/messages") // Base path for REST API endpoints in this controller
public class ChatController {

    // Injects the MessageRepository for database operations related to Message entities
    @Autowired
    private MessageRepository messageRepository;


    // Thread-safe Set to track online users
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    // Handles GET requests for retrieving messages for a specific user
    @GetMapping("/{username}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String username) {
        // Retrieves a list of messages by username (assuming 'receiver' refers to the user receiving messages)
        List<Message> messages = messageRepository.findByReceiver(username);
        // Returns the list of messages as an HTTP 200 OK response with the list as JSON
        return ResponseEntity.ok(messages);
    }

    // Handles POST requests to send a new message
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now()); // Sets the timestamp to the current time
        Message savedMessage = messageRepository.save(message); // Saves the message to the database
        // Returns the saved message as an HTTP 200 OK response with the message data in JSON
        return ResponseEntity.ok(savedMessage);
    }

    @MessageMapping("/chat/{group}")
    @SendTo("/topic/messages/{group}")
    public Message broadcastMessage(@DestinationVariable String group, Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setGroup(group);
        messageRepository.save(message);
        System.out.println("Broadcasting message to group: " + group + " Message: " + message);
        return message;
    }

    @MessageMapping("/typing/{group}")
    @SendTo("/topic/typing/{group}")
    public String handleTypingNotification(@DestinationVariable String group, String typingUser) {
        System.out.println("Typing notification for group: " + group + " User: " + typingUser);
        return typingUser;
    }

        // WebSocket: Handle typing notifications
       /*@MessageMapping("/typing")
       @SendTo("/topic/typing")
        public String handleTypingNotification(String typingUser) {
        // Log for debugging purposes
           System.out.println("Typing notification received from: " + typingUser);
            return typingUser; // Broadcasts the username of the user typing
        }*/

        // WebSocket: Add user to online list and broadcast updated list
        @MessageMapping("/online")
        @SendTo("/topic/onlineUsers")
        public Set<String> handleUserPresence(String username) {
            System.out.println("User online: " + username);
            onlineUsers.add(username);
            return onlineUsers; // Broadcast updated list of online users
        }
        // WebSocket: Remove user from online list and broadcast updated list
        @MessageMapping("/offline")
        @SendTo("/topic/online-users")
        public Set<String> handleUserOffline(String username) {
            onlineUsers.remove(username);
            return onlineUsers; // Broadcast updated list of online users
        }
    }

