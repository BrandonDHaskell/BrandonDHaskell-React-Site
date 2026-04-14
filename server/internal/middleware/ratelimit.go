package middleware

import (
	"log/slog"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"
)

// visitor tracks the request count for a single IP within the current window.
type visitor struct {
	count       int
	windowStart time.Time
}

// RateLimiter holds the shared state for per-IP request rate limiting.
// Create one via NewRateLimiter and stop its cleanup goroutine with Stop().
type RateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor

	// Configuration
	max    int           // maximum requests per window
	window time.Duration // window length

	stop chan struct{} // signals the cleanup goroutine to exit
}

// NewRateLimiter creates a rate limiter that allows max requests per IP
// within each rolling window. It starts a background goroutine that evicts
// stale entries every cleanupInterval to prevent unbounded memory growth.
//
// Call Stop() during shutdown to release the cleanup goroutine.
func NewRateLimiter(max int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors: make(map[string]*visitor),
		max:      max,
		window:   window,
		stop:     make(chan struct{}),
	}

	// Evict expired entries at twice the window interval
	go rl.cleanupLoop(window * 2)

	return rl
}

// Stop shuts down the background cleanup goroutine.
func (rl *RateLimiter) Stop() {
	close(rl.stop)
}

// cleanupLoop periodically removes visitors whose window has expired.
func (rl *RateLimiter) cleanupLoop(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-rl.stop:
			return
		case now := <-ticker.C:
			rl.mu.Lock()
			for ip, v := range rl.visitors {
				if now.Sub(v.windowStart) > rl.window {
					delete(rl.visitors, ip)
				}
			}
			rl.mu.Unlock()
		}
	}
}

// allow checks whether the given IP may proceed. If the visitor's current
// window has expired, it resets the counter. Returns true if under the limit.
func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	v, exists := rl.visitors[ip]

	if !exists || now.Sub(v.windowStart) > rl.window {
		rl.visitors[ip] = &visitor{count: 1, windowStart: now}
		return true
	}

	v.count++
	return v.count <= rl.max
}

// Limit returns middleware that rejects requests from any IP exceeding
// the configured rate with 429 Too Many Requests and a Retry-After header.
func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := extractIP(r)

		if !rl.allow(ip) {
			retryAfter := int(rl.window.Seconds())
			w.Header().Set("Retry-After", strconv.Itoa(retryAfter))
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			slog.Warn("rate limited",
				"ip", ip,
				"path", r.URL.Path,
			)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// extractIP returns the client IP, preferring X-Real-IP (set by Nginx)
// and falling back to the direct connection address.
func extractIP(r *http.Request) string {
	// Nginx sets X-Real-IP from the actual client address
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return ip
	}

	// Fallback: strip the port from RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
