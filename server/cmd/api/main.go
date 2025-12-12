package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"BrandonDHaskell-React-Site/server/internal/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	mux := http.NewServeMux()

	// Health & diagnostic endpoints
	mux.HandleFunc("/healthz", handlers.HealthHandler)

	// Mount API under /api (future endpoints go here)
	mux.HandleFunc("/api/hello", handlers.HelloHandler)

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Go API server listening on :%s", port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}
