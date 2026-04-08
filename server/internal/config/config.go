package config

import (
	"log"
	"os"
	"path/filepath"
)

type Config struct {
	Port      string
	Env       string
	StaticDir string

	// Future use — leave empty until features require them
	DatabaseURL   string
	SessionSecret string
	CORSOrigins   string
}

func Load() Config {
	cfg := Config{
		Port:          envOrDefault("PORT", "4000"),
		Env:           envOrDefault("GO_ENV", "development"),
		StaticDir:     envOrDefault("STATIC_DIR", "./static"),
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		SessionSecret: os.Getenv("SESSION_SECRET"),
		CORSOrigins:   envOrDefault("CORS_ORIGINS", "*"),
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
