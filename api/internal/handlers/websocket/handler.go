package websocket

import (
	"log"
	"net/http"

	ws "aframe/api/internal/websocket"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleWebSocket(c *gin.Context) {
	id := c.Param("id")

	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "invalid_id",
			"message": "ID must be a valid UUID",
		})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade WebSocket: %v", err)
		return
	}

	connectionID := uuid.New().String()
	connection := ws.NewConnection(connectionID, id, conn)

	ws.Pool.Register(connection)

	ackMsg, err := ws.NewMessage(ws.MessageTypeConnectionAck, map[string]string{
		"id":      id,
		"message": "Connected to session",
	})
	if err != nil {
		log.Printf("Failed to create ack message: %v", err)
	} else {
		connection.Send <- ackMsg
	}

	go connection.WritePump()
	go connection.ReadPump()
}
