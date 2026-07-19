package websockets

import (
	"net/http"

	"github.com/gorilla/websocket"
)

const MaxReadWriteBufferBytes = 1024

func WebsocketUpgrader() *websocket.Upgrader {
	return &websocket.Upgrader{
		ReadBufferSize:  MaxReadWriteBufferBytes,
		WriteBufferSize: MaxReadWriteBufferBytes,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
}
