# DeepBrief 🚀

**AI-Powered Jargon Explainer Chrome Extension**

DeepBrief is a full-stack Chrome extension that helps you understand technical jargon instantly. Simply highlight any technical term on a webpage, right-click, and get a clear, student-friendly explanation powered by Google's Gemini 2.5 Flash Lite AI.

---

## ✨ Features

- 🎯 **Right-Click to Explain** - Highlight any text and get instant explanations
- 🤖 **AI-Powered** - Uses Gemini 2.5 Flash Lite for intelligent, context-aware explanations
- 🔒 **Secure Architecture** - API keys hidden in backend proxy (not exposed in extension)
- ⚡ **Fast & Lightweight** - Optimized for speed with minimal overhead
- 🎨 **Beautiful UI** - Sleek floating tooltips with smooth animations
- 🌐 **Cloud-Deployed** - Backend hosted on Google Cloud Run (free tier)

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Chrome Browser │
│   (Extension)   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Cloud Run API  │
│   (Go Backend)  │
└────────┬────────┘
         │ API Key
         ▼
┌─────────────────┐
│  Gemini 2.5 AI  │
│  (Flash Lite)   │
└─────────────────┘
```

**Why this architecture?**
- ✅ **Security**: API keys never exposed in client-side code
- ✅ **Scalability**: Cloud Run auto-scales from 0 to 100 instances
- ✅ **Cost-Effective**: Free tier covers 2M requests/month
- ✅ **Best Practices**: Follows Chrome extension security guidelines

---

## 🚀 Live Demo

**Backend API:** `https://deepbrief-api-ble76liyba-uc.a.run.app`

Try it:
```bash
curl -X POST https://deepbrief-api-ble76liyba-uc.a.run.app/explain \
  -H "Content-Type: application/json" \
  -d '{"text": "What is Docker?"}'
```

---

## 📁 Project Structure

```
DeepBrief/
├── backend/              # Go backend API
│   ├── main.go          # Main server with Gemini integration
│   ├── Dockerfile       # Container configuration
│   └── go.mod           # Go dependencies
├── extension/           # Chrome extension (coming soon)
└── docs/                # Documentation
    ├── DEPLOYMENT.md    # Deployment guide
    ├── BACKEND_README.md
    └── TEST_COMMANDS.md
```

---

## 🛠️ Tech Stack

### Backend
- **Language:** Go 1.21
- **AI Model:** Google Gemini 2.5 Flash Lite
- **Hosting:** Google Cloud Run
- **Container:** Docker (multi-stage build)

### Frontend (Extension)
- **Framework:** Chrome Extension Manifest V3
- **UI:** Shadow DOM for isolated styling
- **Features:** Context menus, content scripts

---

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Cloud Run deployment details
- [Backend README](docs/BACKEND_README.md) - Backend API documentation
- [Test Commands](docs/TEST_COMMANDS.md) - Local testing guide

---

## 🧪 Development

### Prerequisites
- Go 1.21+
- Google Cloud SDK
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SoroushRF/DeepBrief.git
   cd DeepBrief/backend
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Run locally:**
   ```bash
   go mod download
   go run main.go
   ```

4. **Test the API:**
   ```bash
   curl -X POST http://localhost:8080/explain \
     -H "Content-Type: application/json" \
     -d '{"text": "machine learning"}'
   ```

---

## 🌐 Deployment

Deploy to Google Cloud Run:

```bash
gcloud run deploy deepbrief-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 🔒 Security

- ✅ API keys stored as environment variables (never in code)
- ✅ Backend proxy pattern prevents key exposure
- ✅ CORS configured for Chrome extension access
- ✅ HTTPS-only communication
- ✅ No sensitive data logged

---

## 📊 Status

- ✅ **Phase 1:** Backend API (Complete)
- ✅ **Phase 2:** Cloud Deployment (Complete)
- ⏳ **Phase 3:** Chrome Extension (In Progress)
- ⏳ **Phase 4:** Testing & Polish (Pending)
- ⏳ **Phase 5:** Documentation (Pending)

---

## 📝 License

This project is part of a portfolio demonstration.

---

## 👤 Author

**Soroush Raouf**
- GitHub: [@SoroushRF](https://github.com/SoroushRF)

---

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Google Cloud Platform for hosting infrastructure
- Chrome Extensions team for the excellent documentation

---

**Built with ❤️ using Go, Gemini AI, and Cloud Run**
