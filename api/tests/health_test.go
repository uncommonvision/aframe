package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"aframe/api/internal/handlers"
	"aframe/api/internal/routes"
	"github.com/gin-gonic/gin"
)

func TestHealthCheck(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	routes.Setup(router)

	req, _ := http.NewRequest("GET", "/health", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.Code)
	}

	var result handlers.HealthResponse
	if err := json.Unmarshal(resp.Body.Bytes(), &result); err != nil {
		t.Errorf("Failed to parse response: %v", err)
	}

	if result.Status != "healthy" {
		t.Errorf("Expected status 'healthy', got '%s'", result.Status)
	}
}
