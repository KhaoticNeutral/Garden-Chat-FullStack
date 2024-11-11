package com.example.gardenchat.config;    // Defines the package location for this configuration file

import org.springframework.context.annotation.Bean;    // Import annotation for creating Beans
import org.springframework.context.annotation.Configuration; // Import annotation to mark this as a configuration class
import org.springframework.web.servlet.config.annotation.CorsRegistry; // Import CorsRegistry to manage CORS settings
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; // Import WebMvcConfigurer for custom web configuration

// Marks this class as a Spring configuration class
@Configuration
public class CorsConfig implements WebMvcConfigurer { // Implements WebMvcConfigurer to configure CORS settings

    // Override the method to customize CORS mappings
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Add CORS mappings for endpoints that start with "/api/**"
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // Allow requests only from the frontend origin at http://localhost:3000
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Specify allowed HTTP methods
                .allowedHeaders("*") // Allow all headers to be included in requests
                .allowCredentials(true); // Allow credentials (cookies, authorization headers) to be sent with requests
    }
}
