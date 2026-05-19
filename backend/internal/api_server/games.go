package api_server

import (
	"context"
	"database/sql"
	"log"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

type GameHandler struct {
	Database *sql.DB
}

func (handler *GameHandler) RegisterRoutes(api huma.API) {
	huma.Register(api, huma.Operation{
		Method:        http.MethodPost,
		Path:          "/games",
		Summary:       "Create a new game",
		Tags:          []string{"Games"},
		DefaultStatus: 201,
	}, handler.CreateGame)
	huma.Register(api, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/games",
		Summary: "Get all games",
		Tags:    []string{"Games"},
	}, handler.GetAllGames)
	huma.Register(api, huma.Operation{
		Method:  http.MethodGet,
		Path:    "/games/{id}",
		Summary: "Get a game by ID",
		Tags:    []string{"Games"},
	}, handler.GetGame)
	huma.Register(api, huma.Operation{
		Method:  http.MethodDelete,
		Path:    "/games/{id}",
		Summary: "Delete a game by ID",
		Tags:    []string{"Games"},
	}, handler.DeleteGame)
	huma.Register(api, huma.Operation{
		Method:  http.MethodPatch,
		Path:    "/games/{id}",
		Summary: "Update a game's information",
		Tags:    []string{"Games"},
	}, handler.UpdateGame)
}

type CreateGameRequestPayload struct {
	Body struct {
		GameName string `json:"gameName" doc:"The name of the game" required:"true"`
	}
}

type CreateGameResponse struct {
	Status int `status:"201"`
	Body   struct {
		Id       string `json:"id"`
		GameName string `json:"gameName"`
	}
}

func (handler *GameHandler) CreateGame(
	ctx context.Context, input *CreateGameRequestPayload,
) (*CreateGameResponse, error) {
	var gameRequest CreateGameRequestPayload
	var gameResponse CreateGameResponse

	err := handler.Database.QueryRow(
		"INSERT INTO games (game_name) VALUES ($1) RETURNING id, game_name",
		gameRequest.Body.GameName,
	).Scan(&gameResponse.Body.Id, &gameResponse.Body.GameName)

	if err != nil {
		return nil, huma.Error500InternalServerError("Database Error")
	}
	return &gameResponse, nil
}

type GetAllGamesResponseObject struct {
	Id       string `json:"id"`
	GameName string `json:"gameName"`
}

type GetAllGamesResponse struct {
	Body struct {
		Games []GetAllGamesResponseObject `json:"games" doc:"A list of all games"`
	}
}

func (handler *GameHandler) GetAllGames(
	ctx context.Context, input *struct{},
) (*GetAllGamesResponse, error) {
	rows, err := handler.Database.Query("SELECT id, game_name FROM games")
	if err != nil {
		return nil, huma.Error500InternalServerError("Query Failed")
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
		games.Body.Games = append(games.Body.Games, game)
	}
	return &games, nil
}

type GamePathRequest struct {
	Id string `path:"id" doc:"The Id of the game being request"`
}

type GetGameResponse struct {
	Body struct {
		GameName string `json:"gameName"`
	}
}

func (handler *GameHandler) GetGame(
	ctx context.Context, input *GamePathRequest,
) (*GetGameResponse, error) {
	gameId := input.Id

	var gameResponse GetGameResponse

	err := handler.Database.QueryRow(
		"SELECT game_name FROM games WHERE id = ($1)",
		gameId,
	).Scan(&gameResponse.Body.GameName)

	if err != nil {
		return nil, huma.Error500InternalServerError("Query Failed")
	}
	return &gameResponse, nil
}

type DeleteGameResponse struct {
	Body struct {
		Id       string `json:"id"`
		GameName string `json:"gameName"`
	}
}

func (handler *GameHandler) DeleteGame(
	ctx context.Context, input *GamePathRequest,
) (*DeleteGameResponse, error) {
	gameId := input.Id

	var gameResponse DeleteGameResponse

	err := handler.Database.QueryRow(
		"DELETE FROM games WHERE id = ($1) RETURNING id, game_name", gameId,
	).Scan(&gameResponse.Body.Id, &gameResponse.Body.GameName)
	if err != nil {
		return nil, huma.Error500InternalServerError("Query failed")
	}
	return &gameResponse, nil
}

type UpdateGameRequest struct {
	GamePathRequest

	Body struct {
		GameName *string `json:"gameName" doc:"The updated name of the game" required:"true"`
	}
}

type UpdateGameResponse struct {
	Body struct {
		Id       string `json:"id"`
		GameName string `json:"gameName"`
	}
}

func (handler *GameHandler) UpdateGame(
	ctx context.Context, input *UpdateGameRequest,
) (*UpdateGameResponse, error) {
	var gameRequest UpdateGameRequest
	var gameResponse UpdateGameResponse

	gameId := input.Id

	query := `
	UPDATE games
	SET
		game_name = COALESCE($1, game_name)
	WHERE id = $2
	RETURNING id, game_name
	`

	err := handler.Database.QueryRow(
		query,
		gameRequest.Body.GameName, gameId,
	).Scan(&gameResponse.Body.Id, &gameResponse.Body.GameName)

	if err != nil {
		return nil, huma.Error500InternalServerError("Database Error")
	}
	return &gameResponse, nil
}
