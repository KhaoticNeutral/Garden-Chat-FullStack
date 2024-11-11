package com.example.gardenchat.controller;

import com.example.gardenchat.model.User; // Import the User model
import com.example.gardenchat.repository.UserRepository; // Import UserRepository for database access
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// Marks this class as a REST controller, allowing it to handle REST API requests and return JSON data
@RestController
@RequestMapping("/api/users") // Base path for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:3000") // Allows requests from a specific origin (for CORS)
public class UserController {

    // Injects the UserRepository to perform database operations related to the User entity
    @Autowired
    private UserRepository userRepository;

    // Endpoint for user registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if username already exists in the database
        if (userRepository.findByUsername(user.getUsername()) != null) {
            // If username is taken, return a 400 Bad Request response with a message
            return ResponseEntity.badRequest().body("Username already taken");
        }
        // Save the new user to the database
        userRepository.save(user);
        // Return a success message with HTTP 200 OK status
        return ResponseEntity.ok("User registered successfully");
    }

    // Endpoint for user login, returns a token if login is successful
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // Find the user in the database by username
        Optional<User> user = Optional.ofNullable(userRepository.findByUsername(loginRequest.getUsername()));
        // Check if user exists and password matches
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            // Generate a token (here, a dummy token is used for demonstration)
            String token = "dummy-jwt-token"; // Replace with actual token generation logic
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login Successful");
            // Return the token and success message in the response body
            return ResponseEntity.ok(response);
        } else {
            // If credentials are invalid, return HTTP 401 Unauthorized with a message
            return ResponseEntity.status(401).body("Invalid Credentials");
        }
    }

    // Endpoint to retrieve all registered users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        // Retrieve all users from the database
        List<User> users = userRepository.findAll();
        // Return the list of users as JSON with HTTP 200 OK status
        return ResponseEntity.ok(users);
    }

    // Endpoint to update a user's profile icon
    @PutMapping("/{username}/profile-icon")
    public ResponseEntity<String> updateProfileIcon(@PathVariable String username, @RequestBody String profileIcon) {
        // Find the user by username
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByUsername(username));
        // Check if user exists
        if (userOptional.isPresent()) {
            // Update the user's profile icon and save to the database
            User user = userOptional.get();
            user.setProfileIcon(profileIcon);
            userRepository.save(user);
            // Return a success message with HTTP 200 OK status
            return ResponseEntity.ok("Profile icon updated successfully");
        } else {
            // If user not found, return HTTP 404 Not Found with a message
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
