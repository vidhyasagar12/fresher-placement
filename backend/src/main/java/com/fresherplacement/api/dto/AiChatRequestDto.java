package com.fresherplacement.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequestDto {

    @NotBlank(message = "Prompt cannot be empty")
    private String prompt;

    private List<ChatMessage> messages;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatMessage {
        private String role;
        private String content;
    }
}
