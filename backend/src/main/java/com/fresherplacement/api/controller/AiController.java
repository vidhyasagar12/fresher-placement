package com.fresherplacement.api.controller;

import com.fresherplacement.api.dto.AiChatRequestDto;
import com.fresherplacement.api.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI Tips API", description = "Server-side proxy endpoints for AI career advice and OpenRouter interaction")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Generate AI career advice / interview response (Server-side API Key protected)")
    public ResponseEntity<Map<String, Object>> generateTip(@Valid @RequestBody AiChatRequestDto requestDto) {
        return ResponseEntity.ok(aiService.generateCareerTip(requestDto));
    }
}
