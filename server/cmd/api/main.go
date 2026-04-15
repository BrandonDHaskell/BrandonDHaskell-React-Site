package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"BrandonDHaskell-React-Site/server/internal/config"
	"BrandonDHaskell-React-Site/server/internal/handlers"
	"BrandonDHaskell-React-Site/server/internal/middleware"
)

func main() {
	cfg := config.Load()

	// Rate limiter for API routes — 20 requests per minute per IP.
	// Static assets are excluded since browsers/Cloudflare cache them.
	apiLimiter := middleware.NewRateLimiter(20, 1*time.Minute)
	defer apiLimiter.Stop()

	mux := http.NewServeMux()

	// Health & diagnostic endpoints (not rate-limited — used by monitoring)
	mux.HandleFunc("/healthz", handlers.HealthHandler)

	// Mount API under /api (rate-limited)
	mux.Handle("/api/hello", apiLimiter.Limit(http.HandlerFunc(handlers.HelloHandler)))

	// Serve React static build with SPA fallback
	mux.Handle("/", handlers.SPAHandler(cfg.StaticDir))

	// Apply middleware: Logger → SecureHeaders → CORS → mux
	handler := middleware.Logger(middleware.SecureHeaders(middleware.CORS(cfg.CORSOrigins)(mux)))

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Listen for SIGINT (Ctrl+C) and SIGTERM (systemctl stop/restart).
	// When received, the context cancels and we begin graceful shutdown.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Start the server in a goroutine so the main goroutine can wait for signals
	go func() {
		log.Printf("env=%s | listening on :%s | static=%s", cfg.Env, cfg.Port, cfg.StaticDir)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Block until a shutdown signal is received
	<-ctx.Done()
	log.Println("shutdown signal received, draining connections...")

	// Give in-flight requests a deadline to complete before forcing a stop.
	// This should be shorter than the systemd stop_grace_period (20s in docker-compose).
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}

	log.Println("server stopped gracefully")
}
