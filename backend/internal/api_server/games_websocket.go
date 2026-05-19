package api_server

import (
	"fmt"

	"github.com/NathanNgo/Questbook/backend/internal/websockets"
	"github.com/gorilla/websocket"
)

func (handler *GameHandler) RegisterWebsocketHandlers() {
	handler.WebsocketRouter.SetRoute(websockets.MessageEcho, handler.handleEcho)
}

func (handler *GameHandler) handleEcho(payload []byte, client *websockets.Client) {
	client.Connection.WriteMessage(
		websocket.TextMessage,
		[]byte(
			fmt.Sprintf("Hello %s, your message was %s\n", client.SessionId, payload),
		),
	)
}
