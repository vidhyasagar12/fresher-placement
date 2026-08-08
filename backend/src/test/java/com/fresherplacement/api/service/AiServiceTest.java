package com.fresherplacement.api.service;

import com.fresherplacement.api.dto.AiChatRequestDto;
import java.lang.reflect.Field;
import java.util.Map;

public class AiServiceTest {

    private AiService aiService;

    public void setUp() throws Exception {
        aiService = new AiService();
        setField(aiService, "openRouterApiKey", "sk-or-v1-placeholder");
        setField(aiService, "openRouterBaseUrl", "https://openrouter.ai/api/v1");
        setField(aiService, "rawModels", "google/gemini-2.0-flash-lite-preview-02-05:free,meta-llama/llama-3.3-70b-instruct:free");
    }

    public void generateCareerTip_WithTcsPrompt_ReturnsTcsNqtAdvice() throws Exception {
        setUp();
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to crack TCS NQT 2026?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        if (result == null || !Boolean.TRUE.equals(result.get("success")) || result.get("response") == null || !result.get("response").toString().contains("TCS NQT")) {
            throw new AssertionError("TCS NQT advice test failed");
        }
    }

    public void generateCareerTip_WithResumePrompt_ReturnsResumeBlueprint() throws Exception {
        setUp();
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to write a resume with no experience?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        if (result == null || !Boolean.TRUE.equals(result.get("success")) || result.get("response") == null || !result.get("response").toString().contains("Resume Blueprint")) {
            throw new AssertionError("Resume Blueprint test failed");
        }
    }

    public void generateCareerTip_WithSalaryPrompt_ReturnsNegotiationStrategy() throws Exception {
        setUp();
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to negotiate my first salary CTC?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        if (result == null || !Boolean.TRUE.equals(result.get("success")) || result.get("response") == null || !result.get("response").toString().contains("Salary Negotiation Strategy")) {
            throw new AssertionError("Salary Negotiation test failed");
        }
    }

    public void generateCareerTip_WithColdEmailPrompt_ReturnsColdEmailBlueprint() throws Exception {
        setUp();
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to send cold email for off campus jobs?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        if (result == null || !Boolean.TRUE.equals(result.get("success")) || result.get("response") == null || !result.get("response").toString().contains("Cold Email Blueprint")) {
            throw new AssertionError("Cold Email test failed");
        }
    }

    public void generateCareerTip_WithHrPrompt_ReturnsHrInterviewStrategy() throws Exception {
        setUp();
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("Tell me about yourself in HR interview");

        Map<String, Object> result = aiService.generateCareerTip(request);

        if (result == null || !Boolean.TRUE.equals(result.get("success")) || result.get("response") == null || !result.get("response").toString().contains("STAR Method")) {
            throw new AssertionError("HR Interview test failed");
        }
    }

    private static void setField(Object obj, String fieldName, Object value) throws Exception {
        Field field = obj.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(obj, value);
    }
}
