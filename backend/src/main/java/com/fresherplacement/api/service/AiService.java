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

    @Value("${app.openrouter.models:google/gemini-2.0-flash-lite-preview-02-05:free,meta-llama/llama-3.3-70b-instruct:free,qwen/qwen-2.5-coder-32b-instruct:free}")
    private String rawModels;

    private static final String SYSTEM_PROMPT = """
        You are FresherAI — an expert career advisor for fresh engineering graduates and students in India.
        Provide highly practical, structured, encouraging, and detailed placement guidance.
        Specializations: DSA, Full Stack (Spring Boot + React), TCS/Infosys/Wipro drives, Product Companies (Google/Amazon), Resumes, HR Questions, and Salary Negotiation.
        """;

    public Map<String, Object> generateCareerTip(AiChatRequestDto requestDto) {
        String userQuery = "";
        if (requestDto.getPrompt() != null && !requestDto.getPrompt().isBlank()) {
            userQuery = requestDto.getPrompt();
        } else if (requestDto.getMessages() != null && !requestDto.getMessages().isEmpty()) {
            userQuery = requestDto.getMessages().get(requestDto.getMessages().size() - 1).getContent();
        }

        String answer = null;

        // Try OpenRouter API if a valid, un-truncated API key is provided
        if (openRouterApiKey != null && !openRouterApiKey.isBlank() 
                && !openRouterApiKey.contains("placeholder") 
                && !openRouterApiKey.contains("...") 
                && openRouterApiKey.startsWith("sk-or-v1-")) {
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

                List<String> models = Arrays.stream(rawModels.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

                for (String model : models) {
                    try {
                        Map<String, Object> body = new HashMap<>();
                        body.put("model", model);
                        body.put("messages", apiMessages);
                        body.put("max_tokens", 500);
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

        // Comprehensive Dynamic Placement Advisor Engine
        if (answer == null || answer.isBlank()) {
            answer = generateDynamicPlacementAdvice(userQuery);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("response", answer);
        return result;
    }

    private String generateDynamicPlacementAdvice(String query) {
        String q = query != null ? query.toLowerCase() : "";

        // 1. Top Skills & 2026 Roadmap
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
        }

        // 2. Salary Negotiation & Compensations
        if (q.contains("salary") || q.contains("negotiat") || q.contains("ctc") || q.contains("offer")) {
            return """
                💼 **Fresher Salary Negotiation Strategy (INR):**

                1. **Know the Market Benchmarks:**
                   • Service Companies (TCS/Infosys/Wipro): ₹3.5–7 LPA (fixed CTC structure).
                   • Product Startups / Mid-tier: ₹6–12 LPA.
                   • Tier-1 Product Companies (Amazon/Google/Atlassian): ₹18–35+ LPA.

                2. **How to Negotiate First Offers:**
                   • Never negotiate without a competing offer or high interview performance.
                   • Highlight specific high-impact skills (e.g., Spring Boot, React, Cloud deployments).
                   • Politely request a join-on bonus or variable performance bonus if base pay is fixed.

                3. **Script Template:**
                   *"Thank you for the offer! I'm really excited about the role. Given my hands-on experience building full-stack projects in React and Spring Boot, is there any flexibility in the base component?"*
                """;
        }

        // 2. TCS NQT & Service Companies
        if (q.contains("tcs") || q.contains("nqt") || q.contains("infosys") || q.contains("wipro") || q.contains("accenture")) {
            return """
                📚 **Cracking Service Company Drives (TCS NQT / Infosys / Wipro):**

                1. **Foundation Round (Numerical & Logical):**
                   • Practice Time & Work, Speed & Distance, Ratios, Percentages, and Syllogisms on IndiaBIX.
                   • Target 80%+ accuracy in the foundation section to qualify for Digital/Prime roles.

                2. **Advanced Coding Round:**
                   • **Question 1 (Easy):** String manipulation, array rotations, or prime/factorial logic.
                   • **Question 2 (Medium):** Matrix operations, hashing, or basic dynamic programming (Fibonacci/Coin Change).

                3. **Interview Preparation:**
                   • Be ready to explain your final year project thoroughly (Architecture, DB Schema, Tools used).
                   • Revise OOPs concepts (Inheritance, Polymorphism, Abstraction, Encapsulation) with code examples in Java/C++.
                """;
        }

        // 3. Resume & ATS Optimization
        if (q.contains("resume") || q.contains("cv") || q.contains("ats") || q.contains("experience")) {
            return """
                📄 **Fresher ATS Resume Blueprint (Zero Experience):**

                1. **Header & Contact Info:** Clean single-line header with LinkedIn URL, GitHub profile, Email, and Phone.
                2. **Projects Section (Most Important):**
                   • Detail 2-3 Full Stack projects. Use action verbs: *"Developed REST APIs using Spring Boot, integrated PostgreSQL, and deployed frontend on Vercel."*
                   • Include clickable Live Demo & GitHub repository links.
                3. **Technical Skills Matrix:**
                   • **Languages:** Java, Python, JavaScript, SQL
                   • **Frameworks & Tools:** React 19, Spring Boot 3, Git, Docker, Postman
                   • **Databases:** PostgreSQL, MySQL
                4. **Format Rules:** Single-page PDF, 10-12pt clean font (Inter/Roboto), no graphics or multi-column tables.
                """;
        }

        // 4. Product Companies & Google/Amazon Interviews
        if (q.contains("google") || q.contains("amazon") || q.contains("product") || q.contains("dsa")) {
            return """
                🚀 **Cracking Top Tier Product Interviews (Google / Amazon / Uber):**

                1. **DSA Mastery Roadmap:**
                   • Step 1: Arrays, Two Pointers, Sliding Window, Hashing (50 Problems).
                   • Step 2: Binary Search, Linked Lists, Stacks, Queues, Recursion (40 Problems).
                   • Step 3: Binary Trees, BSTs, Heaps, Graph BFS/DFS (60 Problems).
                   • Step 4: Dynamic Programming & Backtracking (40 Medium/Hard Problems).

                2. **System Design Basics for Freshers:**
                   • Understand Client-Server Architecture, REST vs GraphQL, Database Indexing, and Caching (Redis).

                3. **Amazon Leadership Principles:**
                   • Prepare 2 STAR stories for "Customer Obsession", "Ownership", and "Bias for Action".
                """;
        }

        // 5. Cold Emailing & Off-Campus Job Search
        if (q.contains("cold") || q.contains("email") || q.contains("off campus") || q.contains("apply") || q.contains("naukri")) {
            return """
                📧 **Off-Campus Job Hunting & Cold Email Blueprint:**

                1. **Finding Key Contacts:**
                   • Use LinkedIn Search: Filter by `"Engineering Manager"` or `"Tech Lead"` at target companies.

                2. **Cold Email Subject Line:**
                   `Application for Software Engineer Role | Experienced in Java, Spring Boot & React`

                3. **Email Template:**
                   *"Hi [Manager Name], I noticed your team is building scalable services at [Company]. I'm a final year CS graduate with hands-on experience building REST APIs in Spring Boot and PostgreSQL (deployed live). I'd love to contribute to your engineering team. Resume attached. Best, [Your Name]"*

                4. **Daily Metric:** Apply to 10 verified job posts daily on LinkedIn & Naukri, and send 3 personalized cold emails.
                """;
        }

        // 6. HR & Behavioral Rounds
        if (q.contains("hr") || q.contains("behavioral") || q.contains("tell me about yourself") || q.contains("strength")) {
            return """
                🎯 **Mastering the HR & Behavioral Interview:**

                1. **"Tell Me About Yourself" (60-Second Elevator Pitch):**
                   • **Present:** Final year student / fresh graduate passionate about backend & cloud engineering.
                   • **Past:** Key projects built (e.g., Placement Platform with Spring Boot & PostgreSQL).
                   • **Future:** Excited about this role because [specific company reason].

                2. **Using the STAR Method:**
                   • **Situation:** Context of a problem faced in a group project.
                   • **Task:** Your specific responsibility.
                   • **Action:** Technical steps you executed.
                   • **Result:** Measurable positive outcome (e.g., reduced load time by 30%).
                """;
        }

        // 7. Full Stack & Tech Roadmap
        if (q.contains("roadmap") || q.contains("learn") || q.contains("tech stack") || q.contains("java") || q.contains("react")) {
            return """
                🛠 **2026 Full Stack Java Developer Roadmap for Freshers:**

                1. **Core Java & OOPs:** Fundamentals, Collections Framework, Multithreading, Streams API.
                2. **Backend:** Spring Boot 3, Spring Security, RESTful APIs, JPA / Hibernate ORM.
                3. **Database:** PostgreSQL / MySQL, Writing Complex SQL Queries, Joins & Indexing.
                4. **Frontend:** Modern JavaScript (ES6+), React 19, Hooks, Vite, State Management.
                5. **Deployment:** Docker containers, Git/GitHub, Deploying to Render/Vercel/AWS.
                """;
        }

        // 8. General Fresher Guidance
        return String.format("""
            💡 **Career Advice for Query: "%s"**

            1. **Technical Preparation:** Focus on strengthening your core in **Data Structures & Algorithms (DSA)** and **Full Stack Development (Java Spring Boot + React)**.
            2. **Portfolio & Deployment:** Ensure your projects are hosted on GitHub with live working links deployed on Vercel or Render.
            3. **Job Search Channels:** Actively leverage LinkedIn jobs, Naukri, Unstop, and direct referral requests to Engineering Managers.

            Feel free to ask me specific questions about **TCS NQT**, **Resume Reviews**, **Salary Negotiation**, **Google/Amazon Interviews**, or **HR Questions**! 🚀
            """, query != null ? query.trim() : "Placement Guide");
    }
}

