package websocket_router

import (
	"github.com/gorilla/websocket"
)

// This is what a "Client" looks like.
type Client struct {
	Connection *websocket.Conn
	SessionId string
}

// This is what a HandlerFunc needs to look like.
type HandlerFunc func(payload []byte, client *Client) 

// This is what a "Router" looks like. Right now it just holds a routes mapping.
type Router struct {
	routes map[string]HandlerFunc
}

// This is the constructor method.
func NewRouter() *Router {
	return &Router{
		routes: make(map[string]HandlerFunc),
	}
}

