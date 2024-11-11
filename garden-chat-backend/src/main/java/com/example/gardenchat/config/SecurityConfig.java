// src/main/java/com/example/gardenchat/config/SecurityConfig.java
package com.example.gardenchat.config;    // Defines the package location for the security configuration file

import org.springframework.context.annotation.Bean;    // Import annotation to define a Bean
import org.springframework.context.annotation.Configuration;  // Import annotation to mark this class as a configuration class
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Import HttpSecurity for configuring web-based security
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Import annotation to enable Spring Security
import org.springframework.security.web.SecurityFilterChain; // Import SecurityFilterChain to define the filter chain

// Marks this class as a Spring configuration class
@Configuration
// Enables Spring Security's web security support
@EnableWebSecurity
public class SecurityConfig {

    // Define a security filter chain for the application's HTTP security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection, as this is intended for a stateless REST API
                .csrf(csrf -> csrf.disable())

                // Allow all requests to be permitted without any authentication requirement
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll());

        // Build and return the configured SecurityFilterChain instance
        return http.build();
    }
}
