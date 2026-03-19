package com.substring.chat.controllers;

import com.substring.chat.entities.Room;
import com.substring.chat.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://friend-zone-group-chat.vercel.app"
})
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping("/test")
    public String test() {
        return "ROOM CONTROLLER WORKING";
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists!");
        }
        Room room = new Room();
        room.setRoomId(roomId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomRepository.save(room));
    }
    @PostMapping("/join")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
        }
        return ResponseEntity.ok(room);
    }
}