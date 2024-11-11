package com.example.gardenchat.controller;

import com.example.gardenchat.model.Message; // Import the Message entity/model
import com.example.gardenchat.repository.MessageRepository; // Import the MessageRepository for data access
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

// Annotates this class as a Spring Controller to handle HTTP requests and WebSocket messages
@Controller
@RequestMapping("/api/messages") // Base path for REST API endpoints in this controller
public class ChatController {

    // Injects the MessageRepository for database operations related to Message entities
    @Autowired
    private MessageRepository messageRepository;

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

    // Handles WebSocket messages sent to "/chat" endpoint using STOMP protocol
    @MessageMapping("/chat") // Defines the path for WebSocket messages from clients
    @SendTo("/topic/messages") // Broadcasts the message to subscribers of "/topic/messages"
    public Message broadcastMessage(Message message) {
        message.setTimestamp(LocalDateTime.now()); // Sets the current timestamp for the message
        messageRepository.save(message); // Saves the message to the database
        // Returns the message, which will be sent to all subscribers of "/topic/messages"
        return message;
    }
}
