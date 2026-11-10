package com.atharva.ecommerce.Config;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.HttpRetryOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    // Replaces Spring AI's auto-configured Gemini client (it backs off when one
    // exists) so the SDK's retry can be tuned. Its defaults - 5 attempts backing
    // off 1s, 2s, 4s, 8s - stacked under Spring AI's own retry left a user
    // waiting ~30s for "busy" on a 429. This is now the only retry layer
    // (spring.ai.retry.max-attempts=1); it only retries 408/429/5xx, so a bad
    // key still fails immediately.
    @Bean
    public Client googleGenAiClient(@Value("${spring.ai.google.genai.api-key}") String apiKey) {
        HttpRetryOptions retry = HttpRetryOptions.builder()
                .attempts(3)
                .initialDelay(0.4)   // seconds: 0.4s, then 0.8s
                .maxDelay(2.0)
                .expBase(2.0)
                .build();

        return Client.builder()
                .apiKey(apiKey)
                .httpOptions(HttpOptions.builder()
                        .retryOptions(retry)
                        .timeout(15_000)   // ms, per attempt
                        .build())
                .build();
    }
}
