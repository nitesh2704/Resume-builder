# Verdant AI Resume Builder

AI-powered resume builder with role-specific content suggestions, Spring Boot APIs, MongoDB persistence, JWT security, resume scoring, templates, search/filter, history, and a premium green SaaS UI.

## Stack

- Frontend: React + Vite, Tailwind CSS, Context API, Axios, Formik, Yup, lucide-react
- Backend: Java 17, Spring Boot, Spring Security, JWT, Spring Data MongoDB, Swagger
- Database: MongoDB or MongoDB Atlas
- AI: OpenAI Responses API via `POST /v1/responses`

## Project Structure

```text
backend/
  src/main/java/com/verdantai/resume/
    config/ controller/ dto/ exception/ model/ repository/ security/ service/
frontend/
  src/
    components/ context/ pages/ services/ store/ utils/
sample-data/
docs/
```

## Local Setup

1. Install prerequisites:
   - JDK 17+
   - Maven 3.9+
   - Node.js 20+
   - MongoDB locally, Docker, or MongoDB Atlas

2. Start MongoDB with Docker:

```bash
docker compose up -d
```

3. Configure backend environment:

```bash
set MONGODB_URI=mongodb://localhost:27017/verdant_resume_builder
set JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
set OPENAI_API_KEY=your-openai-key
```

4. Run backend:

```bash
cd backend
mvn spring-boot:run
```

5. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Backend URL: `http://localhost:8081`

Swagger URL: `http://localhost:8081/swagger-ui.html`

## Demo Login

The backend seeds a demo user when MongoDB is empty:

- Email: `demo@verdantai.dev`
- Password: `password123`

## Core Features

- JWT authentication with BCrypt password hashing
- Role-based admin endpoint
- Resume CRUD with user ownership checks
- Search/filter by resume title
- Resume history through saved drafts
- AI content suggestions
- AI grammar correction
- JD matching and ATS-style scoring
- Template gallery
- Live resume preview
- Export PDF using browser print
- Dark/light mode persisted in `localStorage`

## Deployment

Frontend on Vercel:

```bash
cd frontend
npm run build
```

Set `VITE_API_URL` to your deployed backend URL, for example:

```text
VITE_API_URL=https://your-api.onrender.com/api
```

Backend on Render/AWS:

- Build command: `mvn clean package`
- Start command: `java -jar target/resume-builder-0.0.1-SNAPSHOT.jar`
- Required environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `OPENAI_API_KEY`
  - `CORS_ALLOWED_ORIGINS`

MongoDB Atlas:

- Create a cluster
- Add a database user
- Allow your backend host/network
- Put the Atlas connection string in `MONGODB_URI`

## Local Verification Notes

This app was verified locally with:

- Frontend: `npm run build`
- Backend: Maven `test`
- Runtime: Spring Boot on `http://localhost:8081` and Vite on `http://127.0.0.1:5173`
- Auth: demo login and fresh signup both reached the dashboard without network errors

If global `npm` or `mvn` is not on PATH, use the installed tools directly:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev -- --host 127.0.0.1
& "C:\Users\nites\.m2\wrapper\dists\apache-maven-3.9.5-bin\2adeog8mj13csp1uusqnc1f2mo\apache-maven-3.9.5\bin\mvn.cmd" spring-boot:run
```
