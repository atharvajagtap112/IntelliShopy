package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.DTO.SearchFilters;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class AiSearchService {

    private final ChatClient chatClient;

    // ChatClient.Builder is auto-configured by the Spring AI Google GenAI starter
    // (model, key and temperature live in application.properties). The system
    // prompt is a classpath file so it can be edited and versioned like code.
    public AiSearchService(ChatClient.Builder builder,
                           @Value("classpath:prompts/search-filters.st") Resource systemPrompt) {
        this.chatClient = builder.defaultSystem(systemPrompt).build();
    }

    // Transient Gemini failures (503 "high demand", 429 quota) are retried by the
    // SDK client - see Config/GeminiConfig - tuned to fail fast, since a user is
    // waiting on the answer.
    public SearchFilters extractFilters(String query) {
        SearchFilters filters = chatClient.prompt()
                // Passed as a template param, not concatenated: a query that
                // contains { or } would otherwise break template rendering.
                .user(u -> u.text("Search query: {query}").param("query", query))
                .call()
                .entity(SearchFilters.class);
        return filters == null ? null : filters.normalized();
    }
}
