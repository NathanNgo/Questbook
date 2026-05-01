package websocket

import (
	"encoding/json"
	"log"
	"github.com/gorilla/websocket"
)

type HandlerFunc func(payload []byte, connection *websocket.Conn, )

type Router struct {
	routes map[string]HandlerFunc
}

// websocket_router.go
package ws

import (
	"encoding/json"
	"log"
	"github.com/gorilla/websocket"
)

// 1. Define the Envelope
type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// 2. Define what a "Handler Function" looks like
// It takes the raw payload, the connection, and the session ID
type HandlerFunc func(payload []byte, conn *websocket.Conn, sessionId string)

// 3. The Router Struct
type Router struct {
	routes map[string]HandlerFunc
}

func NewRouter() *Router {
	return &Router{
		routes: make(map[string]HandlerFunc),
	}
}

// Handle allows you to register a function to a specific message type
func (r *Router) Handle(msgType string, handler HandlerFunc) {
	r.routes[msgType] = handler
}

// ServeWS takes over the infinite loop
func (r *Router) ServeWS(conn *websocket.Conn, sessionId string) {
	defer conn.Close()

	for {
		_, messageBytes, err := conn.ReadMessage()
		if err != nil {
			log.Println("WebSocket disconnected:", err)
			break
		}

		var msg Message
		if err := json.Unmarshal(messageBytes, &msg); err != nil {
			log.Println("Invalid envelope format")
			continue
		}

		// Look up the handler for this message type
		handler, exists := r.routes[msg.Type]
		if exists {
			// Execute the specific handler
			handler(msg.Payload, conn, sessionId)
		} else {
			log.Printf("No handler found for message type: %s", msg.Type)
		}
	}
}