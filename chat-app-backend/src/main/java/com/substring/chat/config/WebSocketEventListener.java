package com.substring.chat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // roomId -> active usernames
    private final Map<String, Set<String>> roomActiveUsers = new ConcurrentHashMap<>();

    // sessionId -> roomId
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();

    // sessionId -> username
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();

        // ✅ FIX: Sirf main room topic handle karo, active-users topic ignore karo
        if (destination != null
                && destination.startsWith("/topic/room/")
                && !destination.contains("/active-users")) {

            String sessionId = accessor.getSessionId();
            String roomId = destination.replace("/topic/room/", "");

            String username = accessor.getFirstNativeHeader("username");
            if (username == null) username = "user-" + sessionId.substring(0, 5);

            sessionRoomMap.put(sessionId, roomId);
            sessionUserMap.put(sessionId, username);

            roomActiveUsers
                    .computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet())
                    .add(username);

            broadcastCount(roomId);
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        String roomId = sessionRoomMap.remove(sessionId);
        String username = sessionUserMap.remove(sessionId);

        if (roomId != null && username != null) {
            Set<String> users = roomActiveUsers.get(roomId);
            if (users != null) {
                users.remove(username);
                broadcastCount(roomId);
            }
        }
    }

    private void broadcastCount(String roomId) {
        int count = roomActiveUsers.getOrDefault(roomId, Set.of()).size();

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/active-users",
                Map.of("count", count, "roomId", roomId)
        );

        messagingTemplate.convertAndSend(
                "/topic/all-rooms/active-users",
                Map.of("count", count, "roomId", roomId)
        );
    }
}