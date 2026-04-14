# BrandonDHaskell.com — Personal Portfolio Site

A personal portfolio website built from scratch with a React + TypeScript frontend and a Go backend. The site is delivered as a single-page application, served by the Go server, reverse-proxied by Nginx in production, and published behind Cloudflare on AWS EC2.

**Live site:** [https://brandondhaskell.com](https://brandondhaskell.com)

---

## Overview

This repository is both a portfolio site and a working deployment project. It is structured to show:

- a custom React + TypeScript frontend build pipeline without `create-react-app`
- a Go server that serves static assets and provides SPA fallback routing
- a local Docker Compose environment that mirrors the production request flow
- a production deployment flow using packaged static assets, a compiled Go binary, Nginx, and a restart + health-check step

---

## Architecture

```text
                  ┌────────────┐
  visitor ──────▶ │ Cloudflare │  (public TLS, CDN, edge proxy)
                  └─────┬──────┘
                        │ HTTPS
                  ┌─────▼──────┐
                  │   Nginx    │  (reverse proxy on origin)
                  │   :443     │
                  └─────┬──────┘
                        │
                  ┌─────▼──────┐
                  │ Go Server  │  (static files + API)
                  │   :4000    │
                  └────────────┘
```

In production, Cloudflare proxies traffic to the origin over HTTPS using a Cloudflare Origin Certificate. Nginx forwards requests to the Go server. The Go server serves the React build from disk and falls back to `index.html` for client-side routes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Webpack |
| Backend | Go, `net/http` |
| Build Tooling | Webpack, PostCSS, ts-loader, MiniCssExtractPlugin |
| Local Dev Topology | Docker, Docker Compose, Nginx |
| Production Infrastructure | Nginx, Cloudflare, AWS EC2, systemd |
| Deployment | Bash, `scp`, `rsync`, health-check verification |

---

## Key Technical Highlights

- Custom Webpack pipeline with separate base, development, and production configs
- React component architecture backed by TypeScript interfaces
- Accessible modal behavior using custom `useEscapeKey` and `useFocusTrap` hooks
- Dark mode implemented with React context, class-based Tailwind toggling, and `localStorage` persistence
- Image preloading helpers used to reduce visible asset pop-in before animated content is shown
- Go SPA handler that serves static assets directly and falls back to `index.html` for client-side routing
- Local Docker Compose flow that mirrors the production request path: Nginx → Go server → static assets
- Deployment script that packages artifacts, syncs static files, replaces the Go binary, restarts the service, and verifies `/healthz`

---

## Project Structure

```text
├── client/
│   ├── src/
│   │   ├── components/          # React UI components and theme provider
│   │   ├── data/                # Structured project data used by the UI
│   │   ├── hooks/               # Custom accessibility and interaction hooks
│   │   ├── images/              # Image assets bundled into the client build
│   │   ├── utils/               # Shared browser-side utility helpers
│   │   ├── index.css            # Tailwind imports and global styles
│   │   ├── index.html           # HTML template and metadata
│   │   └── index.tsx            # React entrypoint
│   ├── webpack.config.js        # Shared Webpack configuration
│   ├── webpack.dev.js           # Development Webpack dev-server config
│   ├── webpack.prod.js          # Production Webpack build config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go          # Go server entrypoint
│   ├── internal/
│   │   ├── config/              # Environment/config loading
│   │   └── handlers/            # HTTP handlers and SPA file serving
│   ├── static/                  # Built frontend assets served by Go
│   └── go.mod
├── nginx/
│   ├── dev-site.conf            # Local reverse-proxy config for Docker Compose
│   └── prod-site.conf           # Production reverse-proxy config
├── docker/
│   ├── client.Dockerfile        # Client build image
│   └── server.Dockerfile        # Go server image for local topology
├── scripts/
│   ├── deploy.sh                # Package upload and restart script
│   └── shutdown-dev.sh
├── docker-compose.yml           # Local multi-container environment
├── Makefile                     # Common build, package, and deploy commands
└── README.md
```

---

## Frontend Notes

The frontend is implemented as a React single-page application with TypeScript and Tailwind CSS.

Notable implementation details:

- `ThemeContext.tsx` manages light/dark mode and persists the selected theme in `localStorage`
- `useEscapeKey.ts` closes the project detail dialog when Escape is pressed
- `useFocusTrap.ts` keeps keyboard focus inside the modal while it is open and restores prior focus on close
- `imagePreload.ts` preloads project and profile images before they are revealed in the UI
- `projects.ts` separates project content from presentation components

---

## Backend Notes

The Go server currently provides:

- `GET /healthz` for health checks
- `GET /api/hello` as a simple API endpoint
- static file serving from `STATIC_DIR`
- SPA fallback routing so client-side paths resolve to `index.html`

The server is built with the Go standard library and configures `ReadTimeout`, `WriteTimeout`, and `IdleTimeout` on the HTTP server.

---

## Accessibility

This project includes accessibility-focused implementation details in the frontend:

- skip navigation link for keyboard and screen-reader users
- semantic sections for profile, projects, and contact content
- `aria-label` usage on icon-only controls and modal close actions
- keyboard-accessible modal dismissal with Escape
- focus trapping inside the modal while it is open
- preserved focus return when the modal closes

These behaviors are implemented directly in the React code rather than being delegated to a UI component library.

---

## Security and Operations

Production configuration includes the following operational and security-related decisions:

- Cloudflare sits in front of the origin and uses encrypted origin traffic
- the production Nginx config rejects direct HTTP requests with `return 444`
- Nginx forwards requests to the Go server running on localhost
- the Go server defines HTTP timeouts for read, write, and idle connections
- both the local Docker Compose stack and the production deployment process use health checks

---

## Getting Started

### Prerequisites

- Docker and Docker Compose for the local multi-container environment
- Node.js and npm for frontend-only local development
- A Go toolchain compatible with the version declared in `server/go.mod` for backend-only local development

---

### Local Development with Docker Compose

```bash
make dev
```

This starts a three-step local environment:

1. **client** builds the React production assets and copies them into a shared volume, then exits
2. **server** starts the Go application and serves those static assets from `/app/static`
3. **nginx** proxies requests to the Go server and exposes the site at `http://localhost:8080`

This workflow mirrors the production request topology more closely than running a standalone frontend dev server.

---

### Frontend-Only Development

The repository also includes a Webpack dev-server workflow for direct client iteration.

```bash
cd client
npm install
npm start
```

That starts `webpack-dev-server` using `webpack.dev.js` on port `3000`.

---

### Backend-Only Development

```bash
cd server
go run ./cmd/api
```

By default, the server expects static assets in `./static`. If needed, set environment variables before starting the server.

---

## Environment Variables

The server reads configuration from environment variables in `server/internal/config/config.go`.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | HTTP listen port |
| `GO_ENV` | `development` | Environment label used by the server |
| `STATIC_DIR` | `./static` | Directory used for static file serving |
| `DATABASE_URL` | empty | Reserved for future backend features |
| `SESSION_SECRET` | empty | Reserved for future backend features |
| `CORS_ORIGINS` | `*` | Reserved for future backend features |

---

## Build and Packaging

```bash
make build
```

Builds:

- the frontend production bundle into `client/build`
- the Go binary into `server/bin/server`

```bash
make package
```

Packages deployable artifacts into `dist/`:

- `dist/server`
- `dist/static/*`

---

## Deployment

```bash
export DEPLOY_HOST=your-ec2-host
make deploy
```

The deployment script performs the following steps:

1. validates that packaged artifacts exist
2. creates the remote target directory if needed
3. uploads a replacement Go binary as `server.new`
4. syncs static assets with `rsync --delete`
5. renames the replacement binary to `server`
6. restarts the configured service with `systemctl`
7. verifies the deployment by checking `http://localhost:4000/healthz`

Production deployment in this repository is based on a compiled Go binary and copied static assets. Docker Compose is used for local development topology, not for the production runtime shown here.

---

## Design Decisions

**Why a custom Webpack setup?**  
This project uses explicit Webpack configuration so the build pipeline is visible in the repository. The configuration shows the application entrypoint, asset rules, CSS processing, HTML template generation, and separate development and production behavior.

**Why Tailwind CSS?**  
Tailwind keeps styling close to the component markup and works cleanly with the existing build pipeline through PostCSS. The project uses class-based dark mode and production CSS extraction.

**Why custom hooks for modal behavior?**  
The project detail dialog uses `useEscapeKey` and `useFocusTrap` to implement modal keyboard behavior directly in application code. This makes the accessibility behavior visible and reusable without introducing a separate UI framework.

**Why preload images?**  
The profile section and project list rely on image assets as part of the initial presentation. Preloading reduces visible late-loading behavior before the content is shown.

**Why Go for the backend?**  
The current backend needs are modest: serve static files, support a small API surface, and run as a simple deployable service. Go fits that shape well with a compiled binary and a small standard-library HTTP stack.

**Why Docker Compose for local development?**  
The Compose environment mirrors the production-style flow more closely than a purely frontend development server. Requests enter through Nginx and terminate at the Go server that serves the static bundle.

---

## Roadmap

- [x] Add navigation bar with section anchors
- [ ] Add resume download link
- [ ] Add dedicated skills / technologies section
- [ ] Add experience section highlighting professional background
- [ ] Replace early learning projects with more advanced software projects
- [ ] Expand backend middleware and API surface as server needs grow
- [ ] Add database-backed features when the site requires persisted data
- [ ] Improve SEO and social preview metadata
- [ ] Add CI/CD automation for build and deployment validation

---

## Repository Goal

This repository is intended to demonstrate practical software engineering decisions across frontend development, backend delivery, deployment, and production-aware application structure.