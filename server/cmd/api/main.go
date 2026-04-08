package main

import (
	"log"
	"net/http"
	"time"

	"BrandonDHaskell-React-Site/server/internal/config"
	"BrandonDHaskell-React-Site/server/internal/handlers"
)

func main() {
	cfg := config.Load()

	mux := http.NewServeMux()

	// Health & diagnostic endpoints
	mux.HandleFunc("/healthz", handlers.HealthHandler)

	// Mount API under /api (future endpoints go here)
	mux.HandleFunc("/api/hello", handlers.HelloHandler)

	// Serve React static build with SPA fallback
	mux.Handle("/", handlers.SPAHandler(cfg.StaticDir))

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("env=%s | listening on :%s | static=%s", cfg.Env, cfg.Port, cfg.StaticDir)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}
