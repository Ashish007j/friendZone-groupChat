package com.substring.chat.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class StartController {

    @GetMapping("/")
    public String healthCheck() {
        return "Backend is running OK";
    }
}

