package api_server

import (
	"database/sql"
	"fmt"

	"github.com/NathanNgo/Questbook/backend/internal/websockets"
	"github.com/gorilla/websocket"
)

type DebugHandler struct {
	Database        *sql.DB
	WebsocketRouter *websockets.Router
}

func (handler *DebugHandler) RegisterWebsocketHandlers() {
	handler.WebsocketRouter.AddRouteHandler(websockets.MessageEcho, handler.handleEcho)
}

func (handler *DebugHandler) handleEcho(payload []byte, client *websockets.Client) {
	client.Connection.WriteMessage(
		websocket.TextMessage,
		[]byte(
			fmt.Sprintf("Hello %s, your message was %s\n", client.GameId, payload),
		),
	)
}
