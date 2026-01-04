# DeepBrief Backend API

Go backend service for the DeepBrief Chrome Extension, powered by **Gemini 2.5 Flash Lite**.

## 🚀 Features

- **Jargon Explanation API**: POST `/explain` endpoint for technical term explanations
- **Gemini 2.5 Flash Lite**: Latest Google AI model for fast, efficient responses
- **CORS Enabled**: Full Chrome extension compatibility
- **Cloud Run Ready**: Optimized Dockerfile for serverless deployment
- **Secure**: API keys stored as environment variables (never in code)

## 📋 Prerequisites

- Go 1.21 or higher
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   go mod download
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Run the server:**
   ```bash
   go run main.go
   ```

4. **Test the API:**
   ```bash
   curl -X POST http://localhost:8080/explain \
     -H "Content-Type: application/json" \
     -d '{"text": "What is a REST API?"}'
   ```

## 🌐 API Endpoints

### POST `/explain`
Explains technical jargon using Gemini 2.5 Flash Lite.

**Request:**
```json
{
  "text": "quantum entanglement"
}
```

**Response:**
```json
{
  "explanation": "Quantum entanglement is when two particles become connected..."
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## 🐳 Docker

Build and run locally:
```bash
docker build -t deepbrief-api .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key_here deepbrief-api
```

## ☁️ Deployment

See the main project README for Google Cloud Run deployment instructions.

## 🔒 Security

- API keys are **never** hardcoded
- All keys stored as environment variables
- CORS configured for Chrome extension access only (can be restricted further)

## 📝 License

Part of the DeepBrief project.
