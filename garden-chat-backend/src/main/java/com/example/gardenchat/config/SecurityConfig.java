package com.example.gardenchat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // CSRF is often disabled for stateless APIs
                .authorizeRequests()
                .requestMatchers("/ws/**").permitAll() // Allow WebSocket connections
                .anyRequest().permitAll()
                .and()
                .cors(); // Enable CORS globally
        return http.build();
    }
}