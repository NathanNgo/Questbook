package main

import (
	"fmt"
	"log"
	"net/http"
)

const defaultServerPort = ":8080"

func main() {
	router := http.NewServeMux()

	router.HandleFunc(
		"GET /",
		func(responseWriter http.ResponseWriter, request *http.Request) {
				fmt.Fprintln(responseWriter, "Hello, World!")
				fmt.Printf("Received %s\n", request.Method)
		},
	)

	fmt.Printf("Started")

	serverError := http.ListenAndServe(defaultServerPort, router)

	if serverError != nil {
		log.Fatalf("Server failed to start: %v\n", serverError)
	}
}