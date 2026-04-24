package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	apiserver "github.com/NathanNgo/Questbook/backend/internal/api_server"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const defaultServerPort = ":8080"

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") 
		
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatalf("Could not find database")
	}

	database, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer database.Close()

	if err := database.Ping(); err != nil {
		log.Fatalf("Cannot reach datbase: %v", err)
	}

	multiplexer := http.NewServeMux()

	var sessionHandler *apiserver.SessionHandler
	sessionHandler = new(apiserver.SessionHandler)
	sessionHandler.Database = database

	sessionHandler.RegisterRoutes(multiplexer)

	// --- THE FIX IS HERE ---
	
	// 1. Wrap your fully configured multiplexer in the CORS middleware
	wrappedHandler := corsMiddleware(multiplexer)

	log.Printf("Server started on port %s", defaultServerPort)

	// 2. Pass the wrappedHandler to ListenAndServe instead of the raw multiplexer
	if err := http.ListenAndServe(defaultServerPort, wrappedHandler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}