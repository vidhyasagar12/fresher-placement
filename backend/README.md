# FresherPlacement - Enterprise Java Spring Boot 3 Backend API

Production-ready, high-performance REST API backend built with **Java 17/21**, **Spring Boot 3**, **PostgreSQL**, **Spring Data JPA**, **Spring Security 6**, and **Swagger OpenAPI UI**.

---

## Technical Stack Architecture

- **Language & Framework**: Java 17/21 + Spring Boot 3.3.x (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`)
- **Database**: PostgreSQL (with Hibernate JPA)
- **Security**: Spring Security 6 + JJWT + BCryptPasswordEncoder
- **Validation**: Jakarta Validation (`@Valid`, `@NotBlank`, `@NotNull`)
- **Documentation**: Swagger OpenAPI at `/swagger-ui.html`
- **Utilities**: Lombok, Spring 3 `RestClient` for OpenRouter AI Proxy

---

## Package Structure (`com.fresherplacement.api`)

```text
src/main/java/com/fresherplacement/api/
├── FresherPlacementApplication.java    # Main Entry Point
├── config/                              # SecurityConfig, CorsConfig, SwaggerConfig
├── controller/                          # JobController, AiController, AuthController
├── dto/                                 # Request & Response DTOs (JobDto, AiChatRequestDto)
├── entity/                              # JPA Entities (Job, User, WorkType, Role)
├── repository/                          # JobRepository, UserRepository
├── service/                             # JobService, AiService
└── util/                                # JobFingerprintUtil
```

---

## Key Features

1. **Exact Parameter Job Fingerprinting & Deduplication**:
   - `JobFingerprintUtil.generateFingerprint()` normalizes and hashes **Company, Role, Location, Salary, Experience & Description**.
   - `JobService.saveJob()` checks existing DB records before creating new ones, updating matching entries instead of creating duplicate rows.
   - `POST /api/v1/jobs/clean-duplicates` endpoint scans and purges redundant duplicates across the entire PostgreSQL database.

2. **Server-Side AI API Key Protection**:
   - `AiController` (`POST /api/v1/ai/chat`) uses Spring 3 `RestClient` to proxy OpenRouter AI requests server-side.
   - API keys are securely stored in `application.yml` / environment variables (`VITE_OPENROUTER_API_KEY`), keeping frontend bundles 100% safe.

3. **Interactive Swagger Documentation**:
   - Access OpenAPI documentation at: `http://localhost:8080/swagger-ui.html`

---

## How to Run locally

### Prerequisites
1. Installed **Java 17 or Java 21** (`java -version`).
2. PostgreSQL database running on `localhost:5432` with database `fresher_placement_db` (or H2 fallback).

### Steps
1. Navigate to the backend directory:
   ```bash
   cd backend-java
   ```
2. Build and run via Maven:
   ```bash
   mvn spring-boot:run
   ```
3. Test endpoints at `http://localhost:8080/api/v1/jobs` or open Swagger UI at `http://localhost:8080/swagger-ui.html`.
