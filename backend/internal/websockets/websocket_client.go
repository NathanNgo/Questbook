package websockets

import "github.com/gorilla/websocket"

// This is what a "Client" looks like.
type Client struct {
	Connection *websocket.Conn
	GameId     string
	Send       chan []byte
}

func (client *Client) ReadPump(router *Router) {
	return
}

func (client *Client) WritePump(router *Router) {
	return
}
