# AI Resume Analyzer

Production-ready MERN stack web application for uploading and analyzing resumes in PDF or DOCX format.

## 1. Folder Structure

```text
root
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── .env.example
│   ├── package.json
│   └── server.js
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

- Express server with `helmet`, `cors`, `morgan`, JSON parsing, environment loading, and centralized error handling.
- JWT authentication with secure password hashing using `bcryptjs`.
- Resume upload endpoint using `multer` memory storage.
- Text extraction via `pdf-parse` for PDF and `mammoth` for DOCX.
- Resume persistence in MongoDB with Mongoose models.

Main backend files:

- `backend/server.js`
- `backend/controllers/authController.js`
- `backend/controllers/resumeController.js`
- `backend/middleware/authMiddleware.js`
- `backend/middleware/uploadMiddleware.js`
- `backend/middleware/errorHandler.js`

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

- `backend/routes/authRoutes.js`
- `backend/routes/resumeRoutes.js`

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

Run the frontend:

```bash
npm run dev:frontend
```

Build the frontend:

```bash
npm run build:frontend
```

### Production Deployment

This repository is configured to deploy to a single Vercel project from the repo root:

1. Import the repository into Vercel with the root directory set to the repository root.
2. Add Vercel environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://your-project-name.vercel.app`
   - `LANGUAGE_TOOL_API_URL=https://api.languagetool.org/v2/check`
   - `LANGUAGE_TOOL_LANGUAGE=en-US`
   - `MAX_UPLOAD_SIZE_MB=4`
3. Leave `VITE_API_URL` unset or set it to `/api` so the frontend uses the same Vercel deployment for API calls.
4. Redeploy after the variables are saved.

Deployment notes:

- `vercel.json` builds the Vite frontend from `frontend/dist`.
- The backend runs through the root `api/[...path].js` Vercel function and reuses the Express app from `backend/app.js`.
- Client-side React Router paths are rewritten back to `/` so routes like `/login`, `/dashboard`, and `/history` do not 404 on refresh.
- Upload size is capped at 4 MB on Vercel to stay under Vercel function request limits.
- If you use a custom domain, update `CLIENT_URL` to that HTTPS origin. For multiple allowed origins, provide a comma-separated list.

### Notes

- The backend stores resume text and analysis metadata, not the raw uploaded file.
- If the LanguageTool API is temporarily unavailable, the analysis still completes and records a warning.
- The project root includes helper scripts for installing dependencies and running frontend/backend services independently.
