package websocket

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 30 * time.Second
	pingPeriod     = 24 * time.Second
	maxMessageSize = 512 * 1024
)

type Connection struct {
	ID       string
	UUID     string
	Conn     *websocket.Conn
	Send     chan WSMessage
	LastPing time.Time
}

func NewConnection(id, uuid string, conn *websocket.Conn) *Connection {
	return &Connection{
		ID:       id,
		UUID:     uuid,
		Conn:     conn,
		Send:     make(chan WSMessage, 256),
		LastPing: time.Now(),
	}
}

func (c *Connection) ReadPump() {
	defer func() {
		Pool.Unregister(c.ID)
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		var msg WSMessage
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}

		c.handleMessage(msg)
	}
}

func (c *Connection) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.Conn.WriteJSON(message); err != nil {
				log.Printf("Error writing message: %v", err)
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Connection) handleMessage(msg WSMessage) {
	switch msg.Type {
	case MessageTypePing:
		c.LastPing = time.Now()
		log.Printf("Received PING from connection %s", c.ID)
	case MessageTypeChatMessage:
		log.Printf("Received CHAT_MESSAGE from connection %s (uuid: %s)", c.ID, c.UUID)
		Pool.BroadcastToUUID(c.UUID, msg)
	default:
		log.Printf("Unknown message type from connection %s: %s", c.ID, msg.Type)
	}
}
