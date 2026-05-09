package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/NathanNgo/Questbook/backend/internal/websocket_router"

	_ "github.com/jackc/pgx/v5/stdlib"

	_ "github.com/NathanNgo/Questbook/backend/docs"

	httpSwagger "github.com/swaggo/http-swagger"
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

//	@title			Questbook API Server
//	@version		1.0
//	@description	API server for Questbook

func main() {
	// Read env and get database URL.
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatalf("Could not find database")
	}

	// Open database pool.
	database, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	defer func() {
		if err := database.Close(); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}()

	// Attempt to ping database
	if err := database.Ping(); err != nil {
		log.Fatalf("Cannot reach database: %v", err)
	}
	// Create a "router".
	multiplexer := http.NewServeMux()

	// Create a websocket router.
	websocketRouter := websocket_router.NewRouter()

	// Composite literal.
	// Create struct and immediately return a pointer to the struct.
	// Also, assign values to the fields of the struct, such as Database = database.
	gameHandler := &api_server.gameHandler{
		Database:        database,
		WebsocketRouter: websocketRouter,
	}

	// Call "registerroutes" on sessionHandler struct, passing in the router.
	// This will register the relevant callbacks to the relevant methods.
	gameHandler.RegisterRoutes(multiplexer)

	wrappedHandler := corsMiddleware(multiplexer)

	multiplexer.Handle("/swagger/", httpSwagger.Handler(
		httpSwagger.URL("doc.json"),
	))

	log.Printf("Server started on port %s", defaultServerPort)

	if err := http.ListenAndServe(defaultServerPort, wrappedHandler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
