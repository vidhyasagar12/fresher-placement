# FresherPlacement - Monorepo Project

Enterprise Placement Platform with a **React + Vite Frontend** and **Java Spring Boot 3 + PostgreSQL Backend**.

---

## Project Structure

```text
fresher-placement/
├── frontend/                 # React 19 + Vite Frontend App
│   ├── src/                  # React Components, Pages, Hooks, Data
│   ├── public/               # Favicon & Static Assets
│   ├── package.json          # Frontend Dependencies & Scripts
│   ├── vite.config.js        # Vite & Vitest Configuration
│   └── vercel.json           # Single Page App Routing Rules
│
├── backend/                  # Java Spring Boot 3 Backend Service
│   ├── pom.xml               # Maven Configuration & Dependencies
│   ├── README.md             # Backend Architecture & Swagger Documentation
│   └── src/
│       ├── main/java/        # Java Controllers, Services, Entities, DTOs
│       └── main/resources/   # application.yml Database & Security Settings
│
└── package.json              # Root Monorepo Scripts
```

---

## Quick Start Commands

### Frontend Development
```bash
# Run React Frontend
npm run dev

# Build Frontend Bundle
npm run build

# Run Frontend Unit Tests (Vitest)
npm run test
```

### Backend Development
```bash
# Run Java Spring Boot Backend
cd backend
mvn spring-boot:run
```

- **Frontend App**: `http://localhost:5173/`
- **Backend API**: `http://localhost:8080/api/v1/jobs`
- **Swagger Documentation UI**: `http://localhost:8080/swagger-ui.html`
