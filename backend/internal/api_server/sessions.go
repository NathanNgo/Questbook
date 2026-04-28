package api_server

import (
	"database/sql"
	"encoding/json"
	"log"
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
	multiplexer.HandleFunc("PATCH /sessions/{id}", handler.UpdateSession)
}

type CreateSessionRequestPayload struct {
	SessionName string `json:"sessionName"`
}

type CreateSessionResponse struct {
	Id          string `json:"id"`
	SessionName string `json:"sessionName"`
}

// CreateSession godoc
// @Summary Create a new session
// @Description Create a new session with the provided session name
// @Tags sessions
// @Accept json
// @Produce json
// @Param createSessionRequestPayload body CreateSessionRequestPayload
// @Success 201 {object} CreateSessionResponse
// @Failure 400 {string} string "Invalid JSON payload"
// @Failure 500 {string} string "Database Error"
// @Router /sessions [post]
func (handler *SessionHandler) CreateSession(
	writer http.ResponseWriter, request *http.Request,
) {
	var sessionRequest CreateSessionRequestPayload
	var sessionResponse CreateSessionResponse
	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&sessionRequest); err != nil {
		http.Error(writer, "Invalid JSON payload", http.StatusBadRequest)
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
	if err := json.NewEncoder(writer).Encode(sessionResponse); err != nil {
		log.Printf("CreateSession failed to encode response")
	}
}

type GetAllSessionsResponseObject struct {
	Id          string `json:"id"`
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
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("GetAllSessions: failed to close rows: %v", err)
		}
	}()

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
	if err := json.NewEncoder(writer).Encode(sessions); err != nil {
		log.Printf("GetAllSessions failed to encode response")
	}
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
		return
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
	if err := json.NewEncoder(writer).Encode(sessionResponse); err != nil {
		log.Printf("GetSession failed to encode response")
	}
}

type DeleteSessionResponse struct {
	Id          string `json:"id"`
	SessionName string `json:"sessionName"`
}

func (handler *SessionHandler) DeleteSession(
	writer http.ResponseWriter, request *http.Request,
) {
	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "Id is required", http.StatusBadRequest)
		return
	}

	var sessionResponse DeleteSessionResponse

	err := handler.Database.QueryRow(
		"DELETE FROM sessions WHERE id = ($1) RETURNING id, session_name", sessionId,
	).Scan(&sessionResponse.Id, &sessionResponse.SessionName)
	if err != nil {
		http.Error(writer, "Query failed", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(sessionResponse); err != nil {
		log.Printf("DeleteSession failed to encode response")
	}
}

type UpdateSessionRequest struct {
	SessionName *string `json:"sessionName"`
}

type UpdateSessionResponse struct {
	Id          string `json:"id"`
	SessionName string `json:"sessionName"`
}

func (handler *SessionHandler) UpdateSession(
	writer http.ResponseWriter, request *http.Request,
) {
	var sessionRequest UpdateSessionRequest
	var sessionResponse UpdateSessionResponse

	sessionId := request.PathValue("id")
	if sessionId == "" {
		http.Error(writer, "ID is required", http.StatusBadRequest)
		return
	}

	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&sessionRequest); err != nil {
		http.Error(writer, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

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
		sessionRequest.SessionName, sessionId,
	).Scan(&sessionResponse.Id, &sessionResponse.SessionName)
	if err != nil {
		http.Error(writer, "Database Error", http.StatusInternalServerError)
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(writer).Encode(sessionResponse); err != nil {
		log.Printf("UpdateSession failed to encode response")
	}
}
