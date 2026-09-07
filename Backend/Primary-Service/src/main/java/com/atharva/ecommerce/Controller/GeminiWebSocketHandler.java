package com.atharva.ecommerce.Controller;


import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class GeminiWebSocketHandler extends TextWebSocketHandler {


    @Value("${gemini.api.key}")
    private String apiKey;




    // gemini-2.0-flash was retired by Google and began returning 404, which this
    // handler surfaced to the client as {"error":"API call failed"}.
    // "gemini-flash-latest" is an alias that tracks the current flash model, so
    // this will not break again the next time a specific version is sunset.
    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=";

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String userInput = message.getPayload().trim().toLowerCase();
        System.out.println("🔹 Original User Input: " + userInput);

        String response = callGeminiForAnswer(userInput);


        session.sendMessage(new TextMessage(response));
    }






    private String callGeminiForAnswer(String userInput) {




         String prompt="You are an AI that converts messy e-commerce search queries into structured JSON filters.\n" +
                 "\n" +
                 "Use the JSON structure below and fill all fields. \n" +
                 "If a field is not mentioned, use its default value.\n" +
                 "\n" +
                 "JSON Format:\n" +
                 "{\n" +
                 "  \"category\": \"\",\n" +
                 "  \"colors\": [],\n" +
                 "  \"sizes\": [],\n" +
                 "  \"minPrice\": 0,\n" +
                 "  \"maxPrice\": 10000000,\n" +
                 "  \"minDiscount\": 0,\n" +
                 "  \"maxDiscount\": 100000,\n" +
                 "  \"sort\": \"price_low\",\n" +
                 "  \"pageNumber\": 0,\n" +
                 "  \"stock\": \"in_stock\",\n" +
                 "  \"pageSize\": 10\n" +
                 "}\n" +
                 "\n" +
                 "### Category Mapping Rules:\n" +
                 "\n" +
                 "Use ONLY these categories - they are the only ones stocked.\n" +
                 "If the query does not clearly match one, return \"category\": \"\".\n" +
                 "\n" +
                 "- \"mens_kurta\": mens kurta, kurta for men, men kurta, kurta (unless clearly for women), mens ethnic wear\n" +
                 "- \"shirt\": shirt, mens shirt, shirt for men, formal shirt, casual shirt, office shirt\n" +
                 "- \"men_jeans\": jeans, mens jeans, men jeans, mens denim, slim fit jeans\n" +
                 "- \"saree\": saree, sari, silk saree, cotton saree, designer saree\n" +
                 "- \"lengha_choli\": lehenga, lehanga, lengha, choli, lehenga choli, bridal wear, wedding wear, festive wear\n" +
                 "- \"women_dress\": dress, womens dress, gown, frock, party dress, one piece\n" +
                 "- \"women_jeans\": womens jeans, jeans for women, ladies jeans, womens denim\n" +
                 "- \"top\": top, tops, womens top, blouse, womens tshirt, womens office wear, womens everyday wear\n" +
                 "\n" +
                 "### Size Mapping Rules:\n" +
                 "\n" +
                 "- \"extra small\", \"xs\" → \"XS\"\n" +
                 "- \"small\", \"s\" → \"S\"\n" +
                 "- \"medium\", \"m\" → \"M\"\n" +
                 "- \"large\", \"l\" → \"L\"\n" +
                 "- \"extra large\", \"xl\" → \"XL\"\n" +
                 "- \"double xl\", \"xxl\", \"2xl\" → \"XXL\"\n" +
                 "- \"triple xl\", \"xxxl\", \"3xl\" → \"XXXL\"\n" +
                 "\n" +
                 "If multiple sizes are mentioned, add all.\n" +
                 "\n" +
                 "### If Input Is Unclear or Doesn’t Match:\n" +
                 "\n" +
                 "- If no valid category is found, use `\"category\": \"\"`\n" +
                 "- Leave fields like colors, sizes empty if not detected\n" +
                 "- Include `\"unrecognizedText\"` field only if no meaningful fields are extracted\n" +
                 "\n" +
                 "Now generate JSON for this input:";



        try {
            ObjectMapper mapper = new ObjectMapper();

            // Full text to send in "text"
            String fullText = prompt + userInput;

            // Build nested map representing the JSON payload
            Map<String, Object> part = new HashMap<>();
            part.put("text", fullText);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Arrays.asList(part));

            Map<String, Object> content = new HashMap<>();
            content.put("contents", Arrays.asList(parts));

            // Serialize map to JSON string automatically escaping everything


            String jsonPayload = mapper.writeValueAsString(content);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

            String url = GEMINI_URL + apiKey;

            // Gemini returns a transient 503 ("high demand") or 429 often enough that
            // a single attempt makes the whole search feature look broken. Retry a
            // couple of times with backoff before giving up; anything else (a bad
            // key, a retired model) fails fast because retrying will not help.
            ResponseEntity<String> response = null;
            RuntimeException lastError = null;
            for (int attempt = 1; attempt <= 3; attempt++) {
                try {
                    response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
                    lastError = null;
                    break;
                } catch (HttpServerErrorException | HttpClientErrorException.TooManyRequests e) {
                    lastError = (RuntimeException) e;
                    System.err.println("Gemini attempt " + attempt + " failed (" + e.getMessage() + ")");
                    if (attempt < 3) {
                        Thread.sleep(400L * attempt);   // 400ms, then 800ms
                    }
                }
            }
            if (lastError != null) {
                throw lastError;
            }

            String responseBody = response.getBody();

            ObjectMapper mapper1 = new ObjectMapper();
            String rawText = "";

            try {
                JsonNode root = mapper1.readTree(responseBody);
                // Navigate down to candidates[0].content.parts[0].text
                rawText = root.path("candidates").get(0)
                        .path("content")
                        .path("parts").get(0)
                        .path("text")
                        .asText();
            } catch (Exception e) {
                e.printStackTrace();
            }

// Now rawText contains your markdown JSON string (with ```json ... ```)

// Then call your extraction helper to clean it up

            // Then call your extraction helper to clean it up
            String jsonResult = extractJsonFromApiResponse(rawText);

            System.out.println("Clean JSON:\n" + jsonResult);


            System.out.println("🔹 Sent JSON to Gemini: " + jsonPayload);
            System.out.println("🔹 Raw Response from Gemini: " + response.getBody());

            return  jsonResult;
        } catch (Exception e) {
            System.err.println("Gemini call failed after retries: " + e.getMessage());
            return "{\"error\":\"AI search is busy right now. Please try again.\"}";
        }
    }


    public String extractJsonFromApiResponse(String rawText) {
        try {
            // 1. Remove markdown code fences (```json and ```)
            String cleaned = rawText.replaceAll("(?s)```json", "").replaceAll("```", "").trim();

            // 2. Unescape escaped quotes and special characters
            cleaned = cleaned
                    .replace("\\\"", "\"")
                    .replace("\\n", "\n")
                    .replace("\\r", "\r")
                    .replace("\\\\", "\\");

            // Optional: Validate JSON by parsing it
            ObjectMapper mapper = new ObjectMapper();
            Object json = mapper.readValue(cleaned, Object.class);

            // 3. Convert back to pretty JSON string (optional)
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);

        } catch (Exception e) {
            e.printStackTrace();
            return "{}"; // return empty JSON if error
        }
    }
}
