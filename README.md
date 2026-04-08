# BrandonDHaskell.com — Personal Portfolio Site

A full-stack portfolio website built from scratch — no `create-react-app`, no templates. The site is a React + TypeScript single-page application served by a Go backend, with Nginx as a reverse proxy and Cloudflare handling public TLS, deployed on AWS EC2.

🔗 **Live site:** [https://BrandonDHaskell.com](https://BrandonDHaskell.com)

---

## Architecture

```
                  ┌────────────┐
  visitor ──────▶ │ Cloudflare │  (TLS termination, CDN, DDoS protection)
                  └─────┬──────┘
                        │ HTTPS (origin cert)
                  ┌─────▼──────┐
                  │   Nginx    │  (reverse proxy)
                  │   :443     │
                  └─────┬──────┘
                        │
                  ┌─────▼──────┐
                  │ Go Server  │  (API + static file serving)
                  │   :4000    │
                  └────────────┘
```

Cloudflare terminates public TLS and proxies to the origin over HTTPS using a Cloudflare Origin Certificate (Full Strict mode). Nginx reverse-proxies all traffic to the Go server, which serves both the React static build and API routes.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, Webpack |
| **Backend** | Go (API + static file server) |
| **Infrastructure** | Docker, Docker Compose, Nginx, AWS EC2, Elastic IP |
| **TLS / DNS** | Cloudflare (Origin Certificate, DNS, CDN) |
| **Tooling** | Webpack (custom config), PostCSS, Make |

## Project Structure

```
├── client/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components (App, Profile, Projects, Contact)
│   │   ├── images/          # Optimized .webp assets
│   │   ├── index.css        # Tailwind imports + custom fonts
│   │   └── index.html       # Entry HTML with OG meta tags
│   ├── webpack.config.js    # Base Webpack config
│   ├── webpack.dev.js       # Dev server config
│   ├── webpack.prod.js      # Production build config
│   └── tailwind.config.js
├── server/                  # Go server
│   ├── cmd/api/main.go      # Entrypoint
│   └── internal/
│       ├── config/          # Environment variable loading
│       └── handlers/        # Route handlers + SPA static file server
├── nginx/                   # Nginx configuration
│   ├── nginx.conf
│   ├── dev-site.conf
│   └── prod-site.conf
├── docker/                  # Dockerfiles
│   ├── client.Dockerfile
│   ├── server.Dockerfile
│   └── nginx.Dockerfile
├── deploy/                  # Production deployment
│   └── site.service         # systemd unit file
├── scripts/
│   ├── deploy.sh            # Deploy to EC2
│   └── shutdown-dev.sh
├── docker-compose.yml       # Dev environment orchestration
├── Makefile                 # Build, package, deploy commands
└── .env.example             # Environment variable documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local client development without Docker)
- Go 1.21+ (for local server development without Docker)

### Development (Docker Compose)

```bash
make dev
```

This starts three services:

- **client** — Webpack dev server with hot reload on port 3000
- **server** — Go API server on port 4000
- **nginx** — Reverse proxy exposed on port 8080

Visit `http://localhost:8080` to view the site.

### Build & Deploy

```bash
# Build client and server, assemble into dist/
make package

# Deploy to production
export DEPLOY_HOST=your-ec2-ip
make deploy
```

### Other Commands

```bash
make build          # Build both client and server
make build-client   # Build React production bundle only
make build-server   # Compile Go binary only
make clean          # Remove build artifacts
make help           # Show all available commands
```

## Design Decisions

**Why no `create-react-app`?** I wanted to understand the full build pipeline — Webpack configuration, loader setup, dev server proxying, production optimization — rather than relying on abstracted tooling.

**Why Go?** Go compiles to a single binary, has an excellent standard library for HTTP serving, and performs well for serving both static files and API routes. Deployment is copying a binary and a folder.

**Why Cloudflare + Nginx + Go?** Cloudflare handles public TLS, caching, and DDoS protection at the edge. Nginx handles reverse proxying on the origin. Go serves the application. Each layer does what it's best at.

## Roadmap

- [ ] Add navigation bar with section anchors and resume download link
- [ ] Add dedicated Skills / Technologies section
- [ ] Add Experience section highlighting professional background
- [ ] Replace early learning projects with more complex full-stack work
- [ ] Add structured routing with middleware (CORS, logging, auth)
- [ ] Add database integration
- [ ] Improve SEO meta tags and social card image
- [ ] Add CI/CD pipeline for automated deployment
