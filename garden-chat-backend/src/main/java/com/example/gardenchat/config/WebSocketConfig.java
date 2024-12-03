// src/main/java/com/example/gardenchat/config/WebSocketConfig.java

package com.example.gardenchat.config;

// Import necessary Spring framework classes for WebSocket configuration
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// Marks this class as a configuration class
@Configuration
// Enables WebSocket message handling, backed by a message broker for routing messages
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Bean
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1); // Pool size can be increased if needed
        scheduler.setThreadNamePrefix("WebSocketHeartBeat-");
        scheduler.initialize();
        return scheduler;
    }

    // Configures the message broker that routes messages from one client to another
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue") // Enables a simple in-memory message broker with specified prefixes
                .setHeartbeatValue(new long[]{10000, 10000}) // Configure heartbeats
                .setTaskScheduler(taskScheduler()); // Use the defined TaskScheduler
        config.setApplicationDestinationPrefixes("/app"); // Defines prefix for messages bound for methods annotated with @MessageMapping
        System.out.println("WebSocket endpoint registered successfully!");
    }

    // Registers a WebSocket endpoint that clients will use to connect to the WebSocket server
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Define WebSocket endpoint at /ws path
                .setAllowedOrigins("http://localhost:3000") // Allow connections only from this origin (frontend URL)
                .withSockJS(); // Enable SockJS fallback options for clients not supporting WebSocket
    }
}
