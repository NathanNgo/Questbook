package api_server

import "github.com/NathanNgo/Questbook/backend/internal/websockets"

func (gameHandler *GameHandler) RegisterWebsocketHandlers() {
	gameHandler.WebsocketRouter.SetRoute("CURSOR_MOVED", test)

	return
}

func test(payload []byte, client *websockets.Client) {
	return
}
