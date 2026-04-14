package config

import (
	"log"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	Port      string
	Env       string
	StaticDir string

	// Comma-separated list of allowed CORS origins.
	// Defaults to the production domain; set CORS_ORIGINS="*" only for local dev.
	CORSOrigins []string

	// Future use — leave empty until features require them
	DatabaseURL   string
	SessionSecret string
}

func Load() Config {
	cfg := Config{
		Port:          envOrDefault("PORT", "4000"),
		Env:           envOrDefault("GO_ENV", "development"),
		StaticDir:     envOrDefault("STATIC_DIR", "./static"),
		CORSOrigins:   parseOrigins(envOrDefault("CORS_ORIGINS", "https://brandondhaskell.com,https://www.brandondhaskell.com")),
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		SessionSecret: os.Getenv("SESSION_SECRET"),
	}

	// Resolve static dir to absolute path and validate
	abs, err := filepath.Abs(cfg.StaticDir)
	if err != nil {
		log.Fatalf("invalid STATIC_DIR path: %v", err)
	}
	if info, err := os.Stat(abs); err != nil || !info.IsDir() {
		log.Fatalf("STATIC_DIR does not exist or is not a directory: %s", abs)
	}
	cfg.StaticDir = abs

	return cfg
}

func (c Config) IsDevelopment() bool {
	return c.Env == "development"
}

func envOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// parseOrigins splits a comma-separated origin string into a trimmed slice.
// Example: "https://example.com, https://www.example.com" → ["https://example.com", "https://www.example.com"]
func parseOrigins(raw string) []string {
	parts := strings.Split(raw, ",")
	origins := make([]string, 0, len(parts))
	for _, p := range parts {
		if trimmed := strings.TrimSpace(p); trimmed != "" {
			origins = append(origins, trimmed)
		}
	}
	return origins
}
