package websocket

import (
	"encoding/json"
	"time"
)

const (
	MessageTypeConnectionAck = "CONNECTION_ACK"
	MessageTypePing          = "PING"
)

type WSMessage struct {
	Type      string          `json:"type"`
	Timestamp time.Time       `json:"timestamp"`
	Data      json.RawMessage `json:"data"`
}

func NewMessage(messageType string, data interface{}) (WSMessage, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return WSMessage{}, err
	}

	return WSMessage{
		Type:      messageType,
		Timestamp: time.Now(),
		Data:      jsonData,
	}, nil
}
