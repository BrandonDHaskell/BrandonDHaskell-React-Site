# ── Build stage ────────────────────────────────────────────────
FROM golang:1.26 AS builder

WORKDIR /app

# Install modules first (cached layer)
COPY go.mod ./
RUN go mod download

# Copy server source and compile static binaries
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o /healthcheck ./cmd/healthcheck

# ── Runtime stage ──────────────────────────────────────────────
# Distroless contains no shell, no package manager, no libc —
# only the binaries and TLS root certificates.
FROM gcr.io/distroless/static-debian12

COPY --from=builder /server /server
COPY --from=builder /healthcheck /healthcheck

EXPOSE 4000

CMD ["/server"]