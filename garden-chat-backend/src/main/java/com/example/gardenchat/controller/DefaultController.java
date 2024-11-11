// src/main/java/com/example/gardenchat/controller/DefaultController.java
package com.example.gardenchat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

// Marks this class as a Spring MVC Controller, handling HTTP requests
@Controller
public class DefaultController {

    // Maps the root URL ("/") to this method, which handles GET requests
    @GetMapping("/")
    @ResponseBody // Indicates that the return value should be the response body rather than a view name
    public String home() {
        // Returns a welcome message as plain text in the HTTP response body
        return "Welcome to the Garden Chat API!";
    }
}
