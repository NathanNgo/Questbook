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

	log.Printf("Server started on port %s", defaultServerPort)

	if err := http.ListenAndServe(defaultServerPort, multiplexer); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}