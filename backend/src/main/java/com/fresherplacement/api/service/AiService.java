package com.fresherplacement.api.service;

import com.fresherplacement.api.dto.AiChatRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${app.openrouter.api-key:sk-placeholder}")
    private String openRouterApiKey;

    @Value("${app.openrouter.base-url:https://openrouter.ai/api/v1}")
    private String openRouterBaseUrl;

    private static final String SYSTEM_PROMPT = """
        You are FresherAI — a friendly, expert career advisor for fresh graduates and final-year students in India.
        You specialize in job hunting strategies, interview prep (DSA, HR, aptitude), resume optimization, and career roadmaps.
        Keep responses practical, structured, encouraging, and India-focused (salary in INR, TCS, Infosys, Google, Naukri).
        """;

    public Map<String, Object> generateCareerTip(AiChatRequestDto requestDto) {
        RestClient restClient = RestClient.builder()
                .baseUrl(openRouterBaseUrl)
                .defaultHeader("Authorization", "Bearer " + openRouterApiKey)
                .defaultHeader("HTTP-Referer", "https://fresherplacement.com")
                .defaultHeader("X-Title", "FresherPlacement Java Backend")
                .build();

        List<Map<String, String>> apiMessages = new ArrayList<>();
        apiMessages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

        if (requestDto.getMessages() != null && !requestDto.getMessages().isEmpty()) {
            requestDto.getMessages().stream()
                    .filter(m -> "user".equalsIgnoreCase(m.getRole()) || "assistant".equalsIgnoreCase(m.getRole()))
                    .forEach(m -> apiMessages.add(Map.of("role", m.getRole(), "content", m.getContent())));
        } else if (requestDto.getPrompt() != null) {
            apiMessages.add(Map.of("role", "user", "content", requestDto.getPrompt()));
        }

        List<String> models = List.of(
                "meta-llama/llama-3-8b-instruct:free",
                "google/gemini-2.5-flash",
                "openai/gpt-3.5-turbo"
        );

        String answer = null;
        String lastError = null;

        for (String model : models) {
            try {
                Map<String, Object> body = new HashMap<>();
                body.put("model", model);
                body.put("messages", apiMessages);
                body.put("max_tokens", 400);
                body.put("temperature", 0.7);

                @SuppressWarnings("unchecked")
                Map<String, Object> response = restClient.post()
                        .uri("/chat/completions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("choices")) {
                    List<?> choices = (List<?>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                        Map<?, ?> message = (Map<?, ?>) choice.get("message");
                        if (message != null) {
                            answer = (String) message.get("content");
                            if (answer != null && !answer.isBlank()) {
                                break;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                lastError = e.getMessage();
            }
        }

        Map<String, Object> result = new HashMap<>();
        if (answer != null) {
            result.put("success", true);
            result.put("response", answer);
        } else {
            result.put("success", false);
            result.put("error", lastError != null ? lastError : "Failed to connect to AI provider");
        }
        return result;
    }
}
