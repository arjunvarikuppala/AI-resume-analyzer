# AI Resume Analyzer

Production-ready MERN stack web application for uploading and analyzing resumes in PDF or DOCX format.

## 1. Folder Structure

```text
root
├── backend
│   ├── APIS
│   ├── Config
│   ├── middleWares
│   ├── models
│   ├── services
│   ├── tests
│   ├── utils
│   ├── .env.example
│   ├── package.json
│   ├── req.http
│   └── server.js
├── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

## 2. Backend Code

- Express backend split into `Config`, `APIS`, `middleWares`, `models`, `services`, and `utils`.
- `backend/server.js` builds the Express app, initializes the database, and runs the Node server.
- The root `server.js` is only a deployment entrypoint for platforms that start from the repo root.
- JWT authentication with secure password hashing using `bcryptjs`.
- Resume upload endpoint using `multer` memory storage.
- Text extraction via `pdf-parse` for PDF and `mammoth` for DOCX.
- Resume persistence in MongoDB with Mongoose models.

Main backend files:

- `backend/server.js`
- `backend/Config/database.js`
- `backend/Config/env.js`
- `backend/APIS/auth/authRoutes.js`
- `backend/APIS/resume/resumeRoutes.js`
- `backend/middleWares/authMiddleware.js`
- `backend/middleWares/uploadMiddleware.js`
- `backend/middleWares/errorHandler.js`

## 3. Database Models

### User

- `email`
- `password`
- `createdAt`

### Resume

- `userId`
- `fileName`
- `mimeType`
- `fileSize`
- `resumeText`
- `score`
- `atsScore`
- `missingSkills`
- `spellingErrors`
- `grammarErrors`
- `missingSections`
- `detectedSkills`
- `formattingIssues`
- `suggestions`
- `analysisWarnings`
- `sectionScores`
- `createdAt`

Model files:

- `backend/models/User.js`
- `backend/models/Resume.js`

## 4. API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Resume

- `POST /api/resume/upload`
- `GET /api/resume/:id`
- `GET /api/resume/history`

Route files:

- `backend/APIS/auth/authRoutes.js`
- `backend/APIS/resume/resumeRoutes.js`

## 5. Resume Analysis Service

Implemented in `backend/services/resumeAnalysisService.js` and `backend/services/languageToolService.js`.

Checks included:

- Required section detection: Education, Skills, Projects, Experience, Contact
- Spelling checks with `nspell`
- Grammar checks using LanguageTool API
- Formatting checks for inconsistent bullet usage and bullet punctuation
- Technical skill detection for React, Node, MongoDB, JavaScript, REST API, and Docker
- Weighted resume scoring:
  - Sections: 20%
  - Grammar: 20%
  - Spelling: 20%
  - Skills: 20%
  - Formatting: 20%

## 6. Frontend React Components

Core components:

- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/ResumeUploadPanel.jsx`
- `frontend/src/components/ScoreOverview.jsx`
- `frontend/src/components/AnalysisListCard.jsx`
- `frontend/src/components/HistoryTable.jsx`
- `frontend/src/components/LoadingSpinner.jsx`

The frontend uses React Router, Axios, TailwindCSS, and a context-based auth session.

## 7. API Integration

Frontend API services:

- `frontend/src/services/api.js`
- `frontend/src/services/authService.js`
- `frontend/src/services/resumeService.js`

Auth state:

- `frontend/src/context/AuthContext.jsx`

The Axios client automatically attaches JWT bearer tokens and clears the session on `401` responses.

## 8. UI Pages

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/HistoryPage.jsx`
- `frontend/src/pages/ResumeDetailPage.jsx`
- `frontend/src/pages/NotFoundPage.jsx`

## 9. Deployment Instructions

### Environment Variables

Backend: copy `backend/.env.example` to `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ai-resume-analyzer
JWT_SECRET=replace_this_with_a_long_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
LANGUAGE_TOOL_API_URL=https://api.languagetool.org/v2/check
LANGUAGE_TOOL_LANGUAGE=en-US
MAX_UPLOAD_SIZE_MB=4
```

Frontend: copy `frontend/.env.example` to `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Local Development

Install dependencies:

```bash
npm run install:all
```

Run the backend:

```bash
npm run dev:backend
```

Run backend smoke tests:

```bash
npm run test --workspace backend
```

Run the frontend:

```bash
npm run dev:frontend
```

Build the frontend:

```bash
npm run build:frontend
```

### Production Deployment

For Node hosting platforms such as Render:

1. Deploy from the repository root.
2. Use the start command `node server.js` or `npm start`.
3. Add backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://your-frontend-domain`
   - `CORS_ORIGINS=https://your-frontend-domain,https://www.your-frontend-domain`
   - `LANGUAGE_TOOL_API_URL=https://api.languagetool.org/v2/check`
   - `LANGUAGE_TOOL_LANGUAGE=en-US`
   - `MAX_UPLOAD_SIZE_MB=4`
   - `NODE_ENV=production`

Deployment notes:

- `backend/server.js` is the single backend entry and contains the Express app setup plus runtime startup.
- The root `server.js` simply forwards startup to `backend/server.js` for platforms that expect a root entry file.
- If your frontend is deployed separately, set `VITE_API_URL` to your backend base URL plus `/api`.
- If you use a custom domain, update `CLIENT_URL` and preferably `CORS_ORIGINS` to the exact HTTPS origins you want to allow.
- `CORS_ORIGINS` supports comma-separated values and wildcard host patterns such as `https://*.vercel.app`.

### Notes

- The backend stores resume text and analysis metadata, not the raw uploaded file.
- If the LanguageTool API is temporarily unavailable, the analysis still completes and records a warning.
- The project root includes helper scripts for installing dependencies and running frontend/backend services independently.
- `backend/req.http` includes ready-to-run REST Client requests for health, auth, resume history, resume detail, and upload testing.
