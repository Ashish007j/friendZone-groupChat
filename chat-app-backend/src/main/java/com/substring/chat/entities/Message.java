package com.substring.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Message {
    private String sender;
    private String content;
    private String timeStamp; // ✅ String

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp = java.time.LocalDateTime.now().toString();
    }
}