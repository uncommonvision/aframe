package tests

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"aframe/server/internal/routes"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

func TestWebSocketUpgrade_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	routes.Setup(router)

	server := httptest.NewServer(router)
	defer server.Close()

	id := uuid.New().String()
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/api/v1/ws/" + id

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect to WebSocket: %v", err)
	}
	defer ws.Close()

	ws.SetReadDeadline(time.Now().Add(2 * time.Second))

	var msg map[string]any
	err = ws.ReadJSON(&msg)
	if err != nil {
		t.Fatalf("Failed to read message: %v", err)
	}

	if msg["type"] != "CONNECTION_ACK" {
		t.Errorf("Expected message type 'CONNECTION_ACK', got '%s'", msg["type"])
	}

	data, ok := msg["data"].(map[string]any)
	if !ok {
		t.Fatal("Expected data to be a map")
	}

	if data["id"] != id {
		t.Errorf("Expected id '%s', got '%s'", id, data["id"])
	}
}

func TestWebSocketUpgrade_InvalidID(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	routes.Setup(router)

	req, _ := http.NewRequest("GET", "/api/v1/ws/invalid-uuid", nil)
	req.Header.Set("Connection", "Upgrade")
	req.Header.Set("Upgrade", "websocket")
	req.Header.Set("Sec-WebSocket-Version", "13")
	req.Header.Set("Sec-WebSocket-Key", "test-key")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", resp.Code)
	}
}

func TestWebSocketPing(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	routes.Setup(router)

	server := httptest.NewServer(router)
	defer server.Close()

	id := uuid.New().String()
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/api/v1/ws/" + id

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect to WebSocket: %v", err)
	}
	defer ws.Close()

	ws.SetReadDeadline(time.Now().Add(2 * time.Second))
	var ackMsg map[string]any
	ws.ReadJSON(&ackMsg)

	pingMsg := map[string]any{
		"type":      "PING",
		"timestamp": time.Now().Format(time.RFC3339),
		"data":      map[string]any{},
	}

	err = ws.WriteJSON(pingMsg)
	if err != nil {
		t.Fatalf("Failed to send PING: %v", err)
	}

	time.Sleep(100 * time.Millisecond)
}
