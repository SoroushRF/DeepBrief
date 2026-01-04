# 🧠 DeepBrief Project Summary

## 🚀 Overview
DeepBrief is a Chrome extension that provides instant, AI-powered explanations for technical jargon. It uses a Go backend on Google Cloud Run to interface with Gemini 2.5 Flash Lite.

## 🔗 Key URLs
- **Backend API:** `https://deepbrief-api-ble76liyba-uc.a.run.app/explain`
- **GitHub Repo:** (Local)
- **Local Server:** `http://localhost:8080`

## 🛠 Tech Stack
- **Frontend:** Chrome Extension (Manifest V3), Vanilla JS, Shadow DOM
- **Backend:** Go (Golang), Google Cloud Run
- **AI Model:** Gemini 2.5 Flash Lite
- **Styling:** Custom CSS (Glassmorphism, Luxury Aesthetics)

## ✨ Key Features
1.  **Context-Aware Explanations:** Right-click any text to explain.
2.  **3-Mode Learning:**
    -   **Concise:** Dictionary definition.
    -   **Simple:** ELI5 analogies.
    -   **Deep Dive:** Context & history.
3.  **Luxury UI:** Animated, glassmorphism design with tabs.
4.  **Privacy:** API keys hidden in backend; no user data stored.

## 📜 Commands
### Run Backend Locally
```powershell
cd backend
go run main.go
```

### Deploy to Cloud Run
```powershell
gcloud run deploy deepbrief-api --source . --region us-central1 --allow-unauthenticated
```
(Note: Ensure `GEMINI_API_KEY` is set in Cloud Run environment variables)

### Test API via Curl
```bash
curl -X POST https://deepbrief-api-ble76liyba-uc.a.run.app/explain \
  -H "Content-Type: application/json" \
  -d '{"text": "Kubernetes"}'
```

## 📂 Project Structure
- `/backend`: Go server code & Dockerfile
- `/extension`: Unpacked Chrome Extension files
- `/docs`: Documentation & Test commands

---
*Created by Antigravity*
