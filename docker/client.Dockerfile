# Dockerfile
# ── Build stage ──────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy manifests first — Docker layer caching skips npm ci
# on subsequent builds if these files haven't changed
COPY package.json package-lock.json ./

# Validates engines field; fails fast on version mismatch
RUN npm ci

COPY . .
RUN npm run build

# ── Production stage ─────────────────────────────────────
FROM node:24-alpine AS production

WORKDIR /app

# Only copy the built output — no devDependencies, no source
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install production deps only
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "build/server.js"]