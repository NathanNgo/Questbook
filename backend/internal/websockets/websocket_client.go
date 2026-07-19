package websockets

import "github.com/gorilla/websocket"

const WebsocketSendChannelBytes = 256

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
	defer client.Connection.Close()
	return
}
