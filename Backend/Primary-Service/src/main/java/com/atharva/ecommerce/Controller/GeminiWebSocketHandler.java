package com.atharva.ecommerce.Controller;

import com.atharva.ecommerce.DTO.SearchFilters;
import com.atharva.ecommerce.Service.AiSearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Component
public class GeminiWebSocketHandler extends TextWebSocketHandler {

    private final AiSearchService aiSearchService;
    private final ObjectMapper mapper = new ObjectMapper();

    public GeminiWebSocketHandler(AiSearchService aiSearchService) {
        this.aiSearchService = aiSearchService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String userInput = message.getPayload().trim().toLowerCase();
        System.out.println("🔹 AI search query: " + userInput);

        session.sendMessage(new TextMessage(search(userInput)));
    }

    // The frontend expects either the filter JSON or {"error": "..."}; keep that
    // contract whatever goes wrong upstream.
    private String search(String userInput) {
        try {
            SearchFilters filters = aiSearchService.extractFilters(userInput);
            return filters == null ? "{}" : mapper.writeValueAsString(filters);
        } catch (Exception e) {
            System.err.println("❌ AI search failed: " + e.getMessage());
            return "{\"error\":\"AI search is busy right now. Please try again.\"}";
        }
    }
}
