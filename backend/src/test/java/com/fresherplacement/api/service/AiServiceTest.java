package com.fresherplacement.api.service;

import com.fresherplacement.api.dto.AiChatRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AiServiceTest {

    private AiService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AiService();
        ReflectionTestUtils.setField(aiService, "openRouterApiKey", "sk-or-v1-b31...101");
        ReflectionTestUtils.setField(aiService, "openRouterBaseUrl", "https://openrouter.ai/api/v1");
        ReflectionTestUtils.setField(aiService, "rawModels", "meta-llama/llama-3.3-70b-instruct:free,google/gemini-2.0-flash-lite-preview-02-05:free");
    }

    @Test
    void generateCareerTip_WithTcsPrompt_ReturnsSmartFallbackOrResponse() {
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to crack TCS NQT 2026?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertNotNull(result.get("response"));
        assertTrue(result.get("response").toString().contains("TCS"));
    }

    @Test
    void generateCareerTip_WithResumePrompt_ReturnsResumeAdvice() {
        AiChatRequestDto request = new AiChatRequestDto();
        request.setPrompt("How to write a resume with no experience?");

        Map<String, Object> result = aiService.generateCareerTip(request);

        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertNotNull(result.get("response"));
        assertTrue(result.get("response").toString().toLowerCase().contains("resume"));
    }
}
