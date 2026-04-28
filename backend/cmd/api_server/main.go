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

func corsMiddleware(multiplexer http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Access-Control-Allow-Origin", "*")

		writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if request.Method == "OPTIONS" {
			writer.WriteHeader(http.StatusOK)
			return
		}

		multiplexer.ServeHTTP(writer, request)
	})
}

// @title Questbook API Server
// @version 1.0
// @description API server for Questbook
func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatalf("Could not find database")
	}

	database, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	defer func() {
		if err := database.Close(); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}()

	if err := database.Ping(); err != nil {
		log.Fatalf("Cannot reach database: %v", err)
	}
	multiplexer := http.NewServeMux()

	sessionHandler := new(apiserver.SessionHandler)
	sessionHandler.Database = database

	sessionHandler.RegisterRoutes(multiplexer)

	wrappedHandler := corsMiddleware(multiplexer)

	log.Printf("Server started on port %s", defaultServerPort)

	if err := http.ListenAndServe(defaultServerPort, wrappedHandler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
