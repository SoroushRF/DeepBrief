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
	Concise  string `json:"concise"`
	Simple   string `json:"simple"`
	DeepDive string `json:"deep_dive"`
	Error    string `json:"error,omitempty"`
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
	explanationResp, err := explainWithGemini(r.Context(), apiKey, req.Text)
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		respondWithError(w, "Failed to generate explanation", http.StatusInternalServerError)
		return
	}

	// Send successful response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(explanationResp)
}

// explainWithGemini uses Gemini 2.5 Flash Lite to explain jargon
func explainWithGemini(ctx context.Context, apiKey, text string) (*ExplainResponse, error) {
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}
	defer client.Close()

	// MANDATORY: Use Gemini 2.5 Flash Lite
	model := client.GenerativeModel("gemini-2.5-flash-lite")

	// Configure the model
	model.SetTemperature(0.4) // Lower temp for more consistent JSON structure
	model.SetTopP(0.95)
	model.SetTopK(40)
	model.SetMaxOutputTokens(800)
	model.ResponseMIMEType = "application/json" // Enforce JSON response

	// System instruction for the AI persona
	systemPrompt := `You are an expert technical explainer specializing in clarifying jargon.

Your Task:
Return a JSON object with 3 separate explanations for the requested term:

1. "concise": A strict, dictionary-style technical definition (max 2 sentences).
2. "simple": A creative, "Equivalent Like I'm 5" (ELI5) analogy-based explanation. Start with "Think of it like..." or "Imagine..." (max 3 sentences).
3. "deep_dive": A deeper look providing context, history, or why it matters (max 4 sentences).

Output must be valid JSON with keys: "concise", "simple", "deep_dive".`

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(systemPrompt)},
	}

	// Create the prompt
	prompt := fmt.Sprintf("Explain this term: %s", text)

	// Generate response
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no response generated")
	}

	// Extract text from response
	responseText := fmt.Sprintf("%v", resp.Candidates[0].Content.Parts[0])

	// Parse JSON
	var explanation ExplainResponse
	if err := json.Unmarshal([]byte(responseText), &explanation); err != nil {
		// Fallback if JSON parsing fails (or model returns markdown block)
		// We'll return just a simple explanation in that case to be safe, or just the raw text
		// But usually with ResponseMIMEType it should be clean.
		log.Printf("Failed to unmarshal JSON from AI: %v\nRaw: %s", err, responseText)
		return nil, fmt.Errorf("failed to parse AI response")
	}

	return &explanation, nil
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
