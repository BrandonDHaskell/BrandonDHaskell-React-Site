package middleware

import "net/http"

// SecureHeaders sets baseline security headers on every response.
//
// These provide defense-in-depth at the origin even when Cloudflare
// adds its own headers at the edge — if a request bypasses the CDN
// (e.g. direct IP access, internal health checks), these still apply.
//
//   - X-Content-Type-Options  — prevents browsers from MIME-sniffing
//     a response away from its declared Content-Type.
//   - X-Frame-Options         — blocks the site from being embedded
//     in iframes (clickjacking protection).
//   - Referrer-Policy         — sends the full URL on same-origin
//     requests but only the origin on cross-origin requests.
//   - Permissions-Policy      — disables browser APIs the site does
//     not use, reducing the attack surface of any future XSS.
func SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

		next.ServeHTTP(w, r)
	})
}
