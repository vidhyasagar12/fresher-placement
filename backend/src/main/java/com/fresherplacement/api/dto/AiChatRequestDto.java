package com.fresherplacement.api.dto;

import java.util.List;

public class AiChatRequestDto {

    private String prompt;
    private List<ChatMessage> messages;

    public AiChatRequestDto() {}

    public AiChatRequestDto(String prompt, List<ChatMessage> messages) {
        this.prompt = prompt;
        this.messages = messages;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public static class ChatMessage {
        private String role;
        private String content;

        public ChatMessage() {}

        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
