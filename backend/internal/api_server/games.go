package api_server

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/NathanNgo/Questbook/backend/internal/websockets"
	"github.com/gorilla/websocket"
)

type GameHandler struct {
	Database        *sql.DB
	WebsocketRouter *websockets.Router
}

func (handler *GameHandler) RegisterRoutes(multiplexer *http.ServeMux) {
	multiplexer.HandleFunc("POST /games", handler.CreateGame)
	multiplexer.HandleFunc("GET /games", handler.GetAllGames)
	multiplexer.HandleFunc("GET /games/{id}", handler.GetGame)
	multiplexer.HandleFunc("DELETE /games/{id}", handler.DeleteGame)
	multiplexer.HandleFunc("PATCH /games/{id}", handler.UpdateGame)
	multiplexer.HandleFunc("GET /games/{id}/websocket", handler.WebsocketUpgradeSession)
}

type CreateGameRequestPayload struct {
	GameName string `json:"gameName"`
}

type CreateGameResponse struct {
	Id       string `json:"id"`
	GameName string `json:"gameName"`
}

// CreateGame godoc
//
//	@Summary		Create a new game
//	@Description	Create a new game with the provided game name
//	@Tags			games
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateGameRequestPayload	true	"Game details"
//	@Success		201		{object}	CreateGameResponse
//	@Failure		400		{string}	string	"Invalid JSON payload"
//	@Failure		500		{string}	string	"Database Error"
//	@Router			/games [post]
func (handler *GameHandler) CreateGame(
	writer http.ResponseWriter, request *http.Request,
) {
	var gameRequest CreateGameRequestPayload
	var gameResponse CreateGameResponse
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&gameRequest); err != nil {
		http.Error(writer, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	err := handler.Database.QueryRow(
		"INSERT INTO games (game_name) VALUES ($1) RETURNING id, game_name",
		gameRequest.GameName,
	).Scan(&gameResponse.Id, &gameResponse.GameName)
	if err != nil {
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(writer).Encode(gameResponse); err != nil {
		log.Printf("CreateGame failed to encode response")
	}
}

type GetAllGamesResponseObject struct {
	Id       string `json:"id"`
	GameName string `json:"gameName"`
}

type GetAllGamesResponse []GetAllGamesResponseObject

// GetAllGames godoc
//
//	@Summary		Gets all games
//	@Description	Get all currently stored games
//	@Tags			games
//	@Produce		json
//	@Success		200	{array}		GetAllGamesResponseObject
//	@Failure		500	{string}	string	"Internal Error"
//	@Router			/games [get]
func (handler *GameHandler) GetAllGames(
	writer http.ResponseWriter, request *http.Request,
) {
	rows, err := handler.Database.Query("SELECT id, game_name FROM games")
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("GetAllGames: failed to close rows: %v", err)
		}
	}()

	games := GetAllGamesResponse{}
	for rows.Next() {
		var game GetAllGamesResponseObject
		if err := rows.Scan(&game.Id, &game.GameName); err != nil {
			continue
		}
		games = append(games, game)
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(games); err != nil {
		log.Printf("GetAllGames failed to encode response")
	}
}

type GetGameResponse struct {
	GameName string `json:"id"`
}

// GetGame godoc
//
//	@Summary		Gets a game by game ID
//	@Description	Finds and returns a game object using an ID
//	@Tags			games
//	@Produce		json
//	@Param			id	path		string	true	"Game ID"
//	@Success		200	{object}	GetGameResponse
//	@Failure		400	{string}	string	"ID is required"
//	@Failure		500	{object}	string	"Internal Error"
//	@Router			/games/{id} [get]
func (handler *GameHandler) GetGame(
	writer http.ResponseWriter, request *http.Request,
) {
	gameId := request.PathValue("id")
	if gameId == "" {
		http.Error(writer, "Id is required", http.StatusBadRequest)
		return
	}

	var gameResponse GetGameResponse

	err := handler.Database.QueryRow(
		"SELECT game_name FROM games WHERE id = ($1)",
		gameId,
	).Scan(&gameResponse.GameName)
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(gameResponse); err != nil {
		log.Printf("GetGame failed to encode response")
	}
}

type DeleteGameResponse struct {
	Id       string `json:"id"`
	GameName string `json:"gameName"`
}

// DeleteGame godoc
//
//	@Summary		Deletes a game by game ID
//	@Description	Deletes a game that matches a given ID
//	@Tags			games
//	@Produce		json
//	@Param			id	path		string	true	"Game ID"
//	@Success		200	{object}	DeleteGameResponse
//	@Failure		400	{string}	string	"ID is required"
//	@Failure		500	{string}	string	"Internal Error"
//	@Router			/games/{id} [delete]
func (handler *GameHandler) DeleteGame(
	writer http.ResponseWriter, request *http.Request,
) {
	gameId := request.PathValue("id")
	if gameId == "" {
		http.Error(writer, "Id is required", http.StatusBadRequest)
		return
	}

	var gameResponse DeleteGameResponse

	err := handler.Database.QueryRow(
		"DELETE FROM games WHERE id = ($1) RETURNING id, game_name", gameId,
	).Scan(&gameResponse.Id, &gameResponse.GameName)
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(gameResponse); err != nil {
		log.Printf("DeleteGame failed to encode response")
	}
}

type UpdateGameRequest struct {
	GameName *string `json:"gameName"`
}

type UpdateGameResponse struct {
	Id       string `json:"id"`
	GameName string `json:"gameName"`
}

func (handler *GameHandler) UpdateGame(
	writer http.ResponseWriter, request *http.Request,
) {
	var gameRequest UpdateGameRequest
	var gameResponse UpdateGameResponse

	gameId := request.PathValue("id")
	if gameId == "" {
		http.Error(writer, "ID is required", http.StatusBadRequest)
		return
	}

	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&gameRequest); err != nil {
		http.Error(writer, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if gameRequest.GameName == nil {
		http.Error(writer, "No fields to update", http.StatusBadRequest)
		return
	}

	query := `
	UPDATE games
	SET
		game_name = COALESCE($1, game_name)
	WHERE id = $2
	RETURNING id, game_name
	`

	err := handler.Database.QueryRow(
		query,
		gameRequest.GameName, gameId,
	).Scan(&gameResponse.Id, &gameResponse.GameName)
	if err != nil {
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(gameResponse); err != nil {
		log.Printf("UpdateGame failed to encode response")
	}
}

func (handler *GameHandler) WebsocketUpgradeSession(
	writer http.ResponseWriter, request *http.Request,
) {
	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "ID is required", http.StatusBadRequest)
		return
	}

	// Upgrade to websocket Connection
	upgrader := websockets.WebsocketUpgrader()
	conn, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		http.Error(
			writer, "Could not upgrade to websocket connection", http.StatusBadRequest,
		)
		return
	}

	// Send data.
	conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Hello %s", sessionId)))

	timer := time.NewTimer(2 * time.Second)
	<-timer.C

	conn.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Hello %s", sessionId)))
}
