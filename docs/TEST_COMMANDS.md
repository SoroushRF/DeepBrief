# Test Commands for DeepBrief API

## Start the server
go run main.go

## Test the /explain endpoint
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"What is a REST API?\"}"

## Test with more complex jargon
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"quantum entanglement\"}"

## Test the health endpoint
curl http://localhost:8080/health

## PowerShell version (for Windows)
Invoke-RestMethod -Uri "http://localhost:8080/explain" -Method POST -ContentType "application/json" -Body '{"text": "What is Docker?"}'
