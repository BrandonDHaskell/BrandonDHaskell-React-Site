package main

import (
	"net/http"
	"os"
	"time"
)

// healthcheck is a minimal binary used by Docker's HEALTHCHECK directive.
// Distroless images have no shell, curl, or wget, so this replaces
// the typical "CMD-SHELL curl -f ..." approach.
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	client := &http.Client{Timeout: 2 * time.Second}
	resp, err := client.Get("http://localhost:" + port + "/healthz")
	if err != nil || resp.StatusCode != http.StatusOK {
		os.Exit(1)
	}
}
