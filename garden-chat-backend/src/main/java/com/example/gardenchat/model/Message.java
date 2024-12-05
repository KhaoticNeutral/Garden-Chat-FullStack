package com.example.gardenchat.model;

import lombok.Data; // Lombok annotation to generate boilerplate code like getters and setters
import org.springframework.data.annotation.Id; // Annotation to mark the primary key field
import org.springframework.data.mongodb.core.mapping.Document; // Annotation to map this class to a MongoDB collection
import java.time.LocalDateTime;

// Lombok's @Data generates getters, setters, toString, equals, and hashCode methods automatically
@Data
// Maps this class to a MongoDB collection named "messages"
@Document(collection = "messages")
public class Message {

    // Marks this field as the primary key in the MongoDB collection
    @Id
    private String id; // Unique identifier for each message (auto-generated by MongoDB)

    // Fields for sender and receiver usernames
    private String sender;   // Username of the user sending the message
    private String receiver; // Username of the user receiving the message

    // Field for the message content
    private String content;  // Text content of the message

    // Field for the timestamp of the message
    private LocalDateTime timestamp; // Date and time when the message was sent

    private String group;
}
