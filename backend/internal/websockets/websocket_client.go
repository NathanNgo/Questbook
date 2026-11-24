package websockets

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

const WebsocketSendChannelBytes = 256

// This is what a "Client" looks like.
type Client struct {
	Connection *websocket.Conn
	GroupId    string
	Send       chan []byte
}

func (client *Client) ReadPump(router *Router) {
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

func (client *Client) WritePump() {
	defer client.Connection.Close()

	for message := range client.Send {
		if error := client.Connection.WriteMessage(
			websocket.TextMessage, []byte(message),
		); error != nil {
			break
		}
	}
}
