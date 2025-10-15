package websocket

import (
	"log"
	"sync"
)

type ConnectionPool struct {
	mu          sync.RWMutex
	connections map[string]*Connection
	index       map[string][]*Connection
}

var Pool = &ConnectionPool{
	connections: make(map[string]*Connection),
	index:       make(map[string][]*Connection),
}

func (p *ConnectionPool) Register(conn *Connection) {
	p.mu.Lock()
	defer p.mu.Unlock()

	p.connections[conn.ID] = conn

	if _, exists := p.index[conn.UUID]; !exists {
		p.index[conn.UUID] = make([]*Connection, 0)
	}
	p.index[conn.UUID] = append(p.index[conn.UUID], conn)

	log.Printf("WebSocket connection registered: %s (uuid: %s)", conn.ID, conn.UUID)
}

func (p *ConnectionPool) Unregister(connID string) {
	p.mu.Lock()
	defer p.mu.Unlock()

	conn, exists := p.connections[connID]
	if !exists {
		return
	}

	delete(p.connections, connID)

	uuidConns := p.index[conn.UUID]
	for i, c := range uuidConns {
		if c.ID == connID {
			p.index[conn.UUID] = append(uuidConns[:i], uuidConns[i+1:]...)
			break
		}
	}

	if len(p.index[conn.UUID]) == 0 {
		delete(p.index, conn.UUID)
	}

	close(conn.Send)

	log.Printf("WebSocket connection unregistered: %s (uuid: %s)", connID, conn.UUID)
}

func (p *ConnectionPool) BroadcastToUUID(uuid string, message WSMessage) {
	p.mu.RLock()
	defer p.mu.RUnlock()

	connections, exists := p.index[uuid]
	if !exists {
		log.Printf("No connections found for uuid: %s", uuid)
		return
	}

	for _, conn := range connections {
		select {
		case conn.Send <- message:
		default:
			log.Printf("Failed to send message to connection %s (channel full)", conn.ID)
		}
	}

	log.Printf("Broadcast message type %s to %d connections (uuid: %s)", message.Type, len(connections), uuid)
}

func (p *ConnectionPool) GetUUIDConnections(uuid string) []*Connection {
	p.mu.RLock()
	defer p.mu.RUnlock()

	return p.index[uuid]
}
