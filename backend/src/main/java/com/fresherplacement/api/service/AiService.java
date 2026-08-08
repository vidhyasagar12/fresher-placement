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
        String userQuery = "";
        if (requestDto.getMessages() != null && !requestDto.getMessages().isEmpty()) {
            userQuery = requestDto.getMessages().get(requestDto.getMessages().size() - 1).getContent();
        } else if (requestDto.getPrompt() != null) {
            userQuery = requestDto.getPrompt();
        }

        String answer = null;

        // Try OpenRouter API if API key is provided
        if (openRouterApiKey != null && !openRouterApiKey.isBlank() && !openRouterApiKey.contains("placeholder")) {
            try {
                RestClient restClient = RestClient.builder()
                        .baseUrl(openRouterBaseUrl)
                        .defaultHeader("Authorization", "Bearer " + openRouterApiKey.trim())
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
                        "meta-llama/llama-3.3-70b-instruct:free",
                        "google/gemini-2.0-flash-lite-preview-02-05:free",
                        "qwen/qwen-2.5-coder-32b-instruct:free"
                );

                for (String model : models) {
                    try {
                        Map<String, Object> body = new HashMap<>();
                        body.put("model", model);
                        body.put("messages", apiMessages);
                        body.put("max_tokens", 450);
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
                    } catch (Exception ignored) {}
                }
            } catch (Exception ignored) {}
        }

        // Intelligent Career Advisor Fallback Engine (Guarantees helpful response)
        if (answer == null || answer.isBlank()) {
            answer = generateSmartFallback(userQuery);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("response", answer);
        return result;
    }

    private String generateSmartFallback(String query) {
        String q = query != null ? query.toLowerCase() : "";

        if (q.contains("skills") || q.contains("2026") || q.contains("need")) {
            return """
                🚀 **Top Skills Indian Freshers Need in 2026:**
                
                1. **Core Data Structures & Algorithms (DSA):** Arrays, Strings, Trees, and Graphs in Java/Python/C++.
                2. **Full Stack Fundamentals:** React 19 / Next.js on frontend + Spring Boot / Node.js on backend.
                3. **Database Proficiency:** SQL (PostgreSQL/MySQL) & ORM tools like JPA/Hibernate.
                4. **Cloud & DevOps Basics:** Basic Git, Docker, and deployment on Vercel/Render/AWS.
                5. **AI Tool Integration:** Familiarity with LLM APIs, prompt engineering, and GitHub Copilot.
                
                💡 *Tip: Build 2 solid full-stack projects showcasing live deployments on GitHub!*
                """;
        } else if (q.contains("tcs") || q.contains("nqt")) {
            return """
                📚 **Complete TCS NQT 2026 Preparation Strategy:**
                
                1. **Numerical & Reasoning Ability:** Practice percentages, ratios, probability, and logical deduction on IndiaBix.
                2. **Verbal Ability:** Focus on sentence correction, vocabulary, and reading comprehension.
                3. **Programming Logic:** Master C/C++/Java basics, loop constructs, recursion, and output prediction.
                4. **Hands-on Coding Round:** Practice 2 problem-solving questions (1 easy string/array, 1 medium problem).
                
                🎯 *Target score: Aim for 75%+ accuracy in Foundation Section!*
                """;
        } else if (q.contains("resume") || q.contains("experience")) {
            return """
                📄 **Fresher Resume Blueprint (Zero Experience Needed):**
                
                • **Header:** Clean formatting with LinkedIn, GitHub, and email links.
                • **Education:** Degree, College Name, Graduation Year, and CGPA (if >7.5).
                • **Projects (Crucial):** List 2-3 full-stack projects with live deployment links & tech stack bullet points.
                • **Technical Skills:** Group by Languages (Java, Python), Frameworks (Spring Boot, React), and Databases (PostgreSQL).
                • **Certifications:** Include relevant online certifications (HackerRank, Coursera, AWS).
                """;
        } else if (q.contains("google") || q.contains("interview")) {
            return """
                🎯 **Cracking Tech Interviews (Google / Product Companies):**
                
                1. **Master LeetCode Mediums:** Focus on Sliding Window, Two Pointers, Dynamic Programming, and Graph BFS/DFS.
                2. **System Design Fundamentals:** Understand REST APIs, Database Indexing, and Caching concepts.
                3. **Mock Interviews:** Practice explaining your thought process out loud while coding.
                4. **Behavioral Questions:** Use the STAR method (Situation, Task, Action, Result) for HR questions.
                """;
        } else {
            return """
                💡 **Fresher Placement Career Advice:**
                
                Focus on building a strong foundation in **Data Structures & Algorithms (DSA)** along with **Full Stack Web Development (React + Spring Boot)**.
                
                • **Daily Goal:** Solve 1-2 LeetCode problems daily.
                • **Portfolio:** Host your projects on GitHub and deploy live links on Vercel / Render.
                • **Networking:** Optimize your LinkedIn profile and apply to early job postings.
                
                Feel free to ask me about TCS NQT, resume building, DSA roadmaps, or interview tips! 🚀
                """;
        }
    }
}
