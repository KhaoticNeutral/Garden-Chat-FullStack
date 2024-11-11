// src/main/java/com/example/gardenchat/controller/FallbackController.java
package com.example.gardenchat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// Marks this class as a Spring MVC Controller
@Controller
public class FallbackController {

    // Maps any URL path that doesn't contain a dot (typically indicating a file extension) to this method
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forwards the request to the "index.html" file in the application
        return "forward:/index.html";
    }
}
