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
	multiplexer.HandleFunc("DELETE /sessions/{id}", handler.DeleteSession)
	multiplexer.HandleFunc("PATCH /sessions/{id}/name", handler.UpdateSession)
}

type CreateSessionRequest struct {
	SessionName string `json:"sessionName"`
}

type CreateSessionResponse struct {
	Id string `json:"id"`
	SessionName string `json:"sessionName"`
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
		"INSERT INTO sessions (session_name) VALUES ($1) RETURNING id, session_name",
		sessionRequest.SessionName,
	).Scan(&sessionResponse.Id, &sessionResponse.SessionName)
	if err != nil {
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(sessionResponse)
}

type GetAllSessionsResponseObject struct {
	Id string `json:"id"`
	SessionName string `json:"sessionName"`
}

type GetAllSessionsResponse []GetAllSessionsResponseObject

func (handler *SessionHandler) GetAllSessions(
	writer http.ResponseWriter, request *http.Request,
) {
	rows, err := handler.Database.Query("SELECT id, session_name FROM sessions")
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	sessions := GetAllSessionsResponse{}
	for rows.Next() {
		var session GetAllSessionsResponseObject
		if err := rows.Scan(&session.Id, &session.SessionName); err != nil {
			continue
		}
		sessions = append(sessions, session)
	}
  
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(sessions)
}

type GetSessionRequest struct {
	Id string `json:"id"`
}

type GetSessionResponse struct {
	SessionName string `json:"id"`
}

func (handler *SessionHandler) GetSession(
	writer http.ResponseWriter, request *http.Request,
) {
	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "Id is required", http.StatusBadRequest)
	}

	var sessionResponse GetSessionResponse

	err := handler.Database.QueryRow(
		"SELECT session_name FROM sessions WHERE id = ($1)",
		sessionId,
	).Scan(&sessionResponse.SessionName)
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(sessionResponse)

}

type DeleteSessionResponse struct {
	Id string `json:"id"`
	SessionName string `json:"sessionName"`
}

func (handler *SessionHandler) DeleteSession(
	writer http.ResponseWriter, request * http.Request,
) {
	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "Id is required", http.StatusBadRequest)
	}

	var sessionResponse DeleteSessionResponse

	err := handler.Database.QueryRow(
		"DELETE FROM sessions WHERE id = ($1) RETURNING id, session_name", sessionId,
	).Scan(&sessionResponse.Id, &sessionResponse.SessionName)
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(sessionResponse)
}

type UpdateSessionRequest struct {
	Id *string `json:"id"`
	SessionName *string `json:"sessionName"`
}

type UpdateSessionResponse struct {
	Id string `json:"id"`
	SessionName string `json:"sessionName"`
}

func (handler *SessionHandler) UpdateSession(
	writer http.ResponseWriter, request *http.Request,
){
	var sessionRequest UpdateSessionRequest
	var sessionResponse UpdateSessionResponse

	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode((&sessionRequest)); err != nil{
		http.Error (writer, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Check if all non-id fields are nil (if so, nothing to update)
	if sessionRequest.SessionName == nil {
		http.Error(writer, "No fields to update", http.StatusBadRequest)
		return
	}

	query := `
	UPDATE sessions
	SET
		session_name = COALESCE($1, session_name)
	WHERE id = $2
	RETURNING id, session_name
	`

	err := handler.Database.QueryRow(
		query, 
		sessionRequest.SessionName, sessionRequest.Id,
		).Scan(&sessionResponse.Id , &sessionResponse.SessionName)
	
	if err != nil{
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(sessionResponse)
}