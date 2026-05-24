package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	apiserver "github.com/NathanNgo/Questbook/backend/internal/api_server"

	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
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

	api := humago.New(multiplexer, huma.DefaultConfig("Questbook API", "1.0.0"))

	gameHandler := new(apiserver.GameHandler)
	gameHandler.Database = database

	gameHandler.RegisterRoutes(api)

	wrappedHandler := corsMiddleware(multiplexer)

	log.Printf("Server started on port %s", defaultServerPort)

	if err := http.ListenAndServe(defaultServerPort, wrappedHandler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
