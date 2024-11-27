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
                .csrf().disable() // Disable CSRF for stateless APIs
                .authorizeRequests()
                .requestMatchers("/ws/**").authenticated() // Secure WebSocket endpoint
                .anyRequest().permitAll() // Allow all other requests
                .and()
                .formLogin() // Optionally add login form
                .permitAll();

        return http.build();
    }
}