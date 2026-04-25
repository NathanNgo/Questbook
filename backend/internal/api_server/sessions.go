package api_server

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type SessionHandler struct {
	Database *sql.DB
}

func (handler *SessionHandler) RegisterRoutes(multiplexer *http.ServeMux) {
	multiplexer.HandleFunc("POST /sessions", handler.CreateSession)
	multiplexer.HandleFunc("GET /sessions", handler.GetAllSessions)
	multiplexer.HandleFunc("GET /sessions/{id}", handler.GetSession)
	// multiplexer.HandleFunc("PUT /sessions", handler.UpdateSession)
	// multiplexer.HandleFunc("DELETE /sessions", handler.DeleteSession)
}

type CreateSessionRequest struct {
	ChannelName string `json:"channelName"`
}

type CreateSessionResponse struct {
	Id string `json:"id"`
	ChannelName string `json:"channelName"`
}

func (handler *SessionHandler) CreateSession(
	writer http.ResponseWriter, request *http.Request,
) {
	var sessionRequest CreateSessionRequest
	var sessionResponse CreateSessionResponse
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&sessionRequest); err != nil {
		http.Error (writer, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	err := handler.Database.QueryRow(
		"INSERT INTO sessions (channel_name) VALUES ($1) RETURNING id, channel_name",
		sessionRequest.ChannelName,
	).Scan(&sessionResponse.Id, &sessionResponse.ChannelName)

	if err != nil {
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(sessionResponse)
}

type GetAllSessionsResponseObject struct {
	ChannelName string `json:"channelName"`
}

type GetAllSessionsResponse []GetAllSessionsResponseObject

func (handler *SessionHandler) GetAllSessions(
	writer http.ResponseWriter, request *http.Request,
) {
	rows, err := handler.Database.Query("SELECT channel_name FROM sessions")
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	sessions := GetAllSessionsResponse{}
	for rows.Next() {
		var session GetAllSessionsResponseObject
		if err := rows.Scan(&session.ChannelName); err != nil {
			continue
		}
		sessions = append(sessions, session)
	}
  
	writer.Header().Set("Content-Type", "application/json")
	json.NewEncoder(writer).Encode(sessions)
}

type GetSessionRequest struct {
	Id string `json:"id"`
}

type GetSessionResponse struct {
	ChannelName string `json:"id"`
}

func (handler *SessionHandler) GetSession(
	writer http.ResponseWriter, request *http.Request,
) {
	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "Id is required", http.StatusInternalServerError)
	}

	var sessionResponse GetSessionResponse

	err := handler.Database.QueryRow(
		"SELECT channel_name FROM sessions WHERE id = ($1)",
		sessionId,
	).Scan(&sessionResponse.ChannelName)

	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")

	json.NewEncoder(writer).Encode(sessionResponse)

}