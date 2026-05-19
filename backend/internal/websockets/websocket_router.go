package websockets

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

const MaxMessageSizeBytes = 4096

// Define a type that is a set union of strings which the Message Type can take on.

// MessageType is a string.
type MessageType string

// Specifically, it is a string which can only take on these values:
const (
	MessageEcho MessageType = "ECHO"
)

// Define what a "Message" looks like
type Message struct {
	Type    MessageType     `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// This is what a "Client" looks like.
type Client struct {
	Connection *websocket.Conn
	SessionId  string
}

// This is what a HandlerFunc needs to look like.
type HandlerFunc func(payload []byte, client *Client)

// This is what a "Router" looks like. Right now it just holds a routes mapping.
type Router struct {
	routes map[MessageType]HandlerFunc
}

// This is the constructor method.
func NewRouter() *Router {
	return &Router{
		routes: make(map[MessageType]HandlerFunc),
	}
}

// Setter for routes.
func (router *Router) SetRoute(routeType MessageType, routeHandler HandlerFunc) {
	router.routes[routeType] = routeHandler
}

// Method on the Router class that starts listening and serving WS connections.
func (router *Router) ServeWebSocket(client *Client) {
	// Defer the close of the connection so we always close the connection.
	defer client.Connection.Close()
	client.Connection.SetReadLimit(MaxMessageSizeBytes)

	// Start an infinite loop
	for {
		// Try to read the message from the connection
		_, messageBytes, err := client.Connection.ReadMessage()
		if err != nil {
			log.Println("Client disconnected or read error")
			break
		}

		// Try to parse the bytes into JSON.
		var message Message
		if err := json.Unmarshal(messageBytes, &message); err != nil {
			log.Println("Failed to unmarshall message")
			client.Connection.WriteMessage(
				websocket.TextMessage,
				[]byte("Failed to unmarshall message"),
			)
			continue
		}

		// Pass the JSON message into the correct handler function.
		// We can get the correct handler function from the mapping "routes".
		// We actually need to run the handler function as well
		if handler, exists := router.routes[message.Type]; exists {
			handler(message.Payload, client)
		} else {
			log.Printf("Could not find route of type %s", message.Type)
		}
	}
}
