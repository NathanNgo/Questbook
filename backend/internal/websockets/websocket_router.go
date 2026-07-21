package websockets

import (
	"encoding/json"
	"sync"
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

// This is what a HandlerFunc needs to look like.
type HandlerFunc func(payload []byte, client *Client)

// This is what a "Router" looks like. Right now it just holds a routes mapping.
type Router struct {
	routes     map[MessageType]HandlerFunc
	games      map[string]map[*Client]bool
	gamesMutex sync.RWMutex
}

// This is the constructor method.
func NewRouter() *Router {
	return &Router{
		routes: make(map[MessageType]HandlerFunc),
		games:  make(map[string]map[*Client]bool),
		// { gameId: { client: bool }}
	}
}

// Setter for routes.
func (router *Router) AddRouteHandler(routeType MessageType, routeHandler HandlerFunc) {
	router.routes[routeType] = routeHandler
}

// Setter for games
func (router *Router) AddClientConnectionToGame(client *Client) {
	router.gamesMutex.Lock()
	defer router.gamesMutex.Unlock()

	if router.games[client.GameId] == nil {
		router.games[client.GameId] = make(map[*Client]bool)
	}

	router.games[client.GameId][client] = true
}

func (router *Router) RemoveClientConnectionFromGame(client *Client) {
	router.gamesMutex.Lock()
	defer router.gamesMutex.Unlock()

	if _, exists := router.games[client.GameId][client]; exists {
		delete(router.games[client.GameId], client)
		close(client.Send)
	}
}

// Method on the Router class that starts listening and serving WS connections.
func (router *Router) ServeWebSocket(client *Client) {
	router.AddClientConnectionToGame(client)

	// Defer the close of the connection so we always close the connection.
	defer func() {
		router.RemoveClientConnectionFromGame(client)
		client.Connection.Close()
	}()

	client.Connection.SetReadLimit(MaxMessageSizeBytes)

	go client.WritePump()
	client.ReadPump(router)
}
