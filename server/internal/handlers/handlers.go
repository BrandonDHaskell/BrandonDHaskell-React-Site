package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
	})
}

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Hello from Go backend",
	})
}

// SPAHandler serves static files from the given directory. If the requested
// file does not exist, it falls back to index.html so that React's client-side
// router can handle the path.
//
// The resolved path is verified to remain within staticDir to prevent
// directory traversal attacks (e.g. GET /../../etc/passwd).
func SPAHandler(staticDir string) http.Handler {
	// Resolve once at startup so every request compares against the same root
	absStaticDir, err := filepath.Abs(staticDir)
	if err != nil {
		panic("SPAHandler: unable to resolve static directory: " + err.Error())
	}

	fs := http.FileServer(http.Dir(absStaticDir))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Resolve the requested path and ensure it stays within the static root
		requested := filepath.Join(absStaticDir, filepath.Clean(r.URL.Path))
		if !strings.HasPrefix(requested, absStaticDir+string(filepath.Separator)) && requested != absStaticDir {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}

		// If the file doesn't exist on disk, fall back to index.html for SPA routing
		if _, err := os.Stat(requested); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(absStaticDir, "index.html"))
			return
		}

		// File exists — serve it directly
		fs.ServeHTTP(w, r)
	})
}
