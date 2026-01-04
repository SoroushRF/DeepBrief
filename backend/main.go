package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

// ExplainRequest represents the incoming JSON payload
type ExplainRequest struct {
	Text string `json:"text"`
}

// ExplainResponse represents the API response
type ExplainResponse struct {
	Explanation string `json:"explanation"`
	Error       string `json:"error,omitempty"`
}

func main() {
	// Load .env file for local development (silently ignore if not present)
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/explain", handleExplain)
	http.HandleFunc("/health", handleHealth)

	log.Printf("🚀 DeepBrief API server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// handleHealth provides a simple health check endpoint
func handleHealth(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

// handleExplain processes jargon explanation requests
func handleExplain(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)

	// Handle preflight OPTIONS request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var req ExplainRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Text == "" {
		respondWithError(w, "Text field is required", http.StatusBadRequest)
		return
	}

	// Get API key from environment
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Println("ERROR: GEMINI_API_KEY environment variable not set")
		respondWithError(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	// Call Gemini API
	explanation, err := explainWithGemini(r.Context(), apiKey, req.Text)
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		respondWithError(w, "Failed to generate explanation", http.StatusInternalServerError)
		return
	}

	// Send successful response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ExplainResponse{
		Explanation: explanation,
	})
}

// explainWithGemini uses Gemini 2.5 Flash Lite to explain jargon
func explainWithGemini(ctx context.Context, apiKey, text string) (string, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", fmt.Errorf("failed to create client: %w", err)
	}
	defer client.Close()

	// MANDATORY: Use Gemini 2.5 Flash Lite
	model := client.GenerativeModel("gemini-2.5-flash-lite")

	// Configure the model
	model.SetTemperature(0.7)
	model.SetTopP(0.95)
	model.SetTopK(40)
	model.SetMaxOutputTokens(500)

	// System instruction for the AI persona
	systemPrompt := `You are a Helpful Senior Engineer explaining technical jargon to students.

Your role:
- Break down complex technical terms into simple, easy-to-understand explanations
- Use analogies and real-world examples when helpful
- Keep explanations concise (2-4 sentences max)
- Be friendly and encouraging
- Avoid being condescending

Format your response as a clear, direct explanation without meta-commentary.`

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(systemPrompt)},
	}

	// Create the prompt
	prompt := fmt.Sprintf("Explain this term or concept simply: %s", text)

	// Generate response
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no response generated")
	}

	// Extract text from response
	explanation := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])
	return explanation, nil
}

// enableCORS adds CORS headers for Chrome extension compatibility
func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// respondWithError sends a JSON error response
func respondWithError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ExplainResponse{
		Error: message,
	})
}
