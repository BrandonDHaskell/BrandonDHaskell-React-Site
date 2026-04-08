.PHONY: build build-client build-server clean dev deploy

# ──────────────────────────────────────────────
# Build
# ──────────────────────────────────────────────

build: build-client build-server ## Build both client and server

build-client: ## Build React production bundle
	cd client && npm run build

build-server: ## Compile Go binary
	cd server && go build -o bin/server ./cmd/api

# ──────────────────────────────────────────────
# Package — assemble deploy artifacts
# ──────────────────────────────────────────────

DIST_DIR := dist

package: build ## Build and assemble deploy artifacts into dist/
	rm -rf $(DIST_DIR)
	mkdir -p $(DIST_DIR)/static
	cp server/bin/server $(DIST_DIR)/server
	cp -r client/build/* $(DIST_DIR)/static/
	@echo "Deploy artifacts ready in $(DIST_DIR)/"

# ──────────────────────────────────────────────
# Deploy
# ──────────────────────────────────────────────

deploy: package ## Build, package, and deploy to production
	./scripts/deploy.sh

# ──────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────

dev: ## Start development environment
	docker compose up --build

# ──────────────────────────────────────────────
# Cleanup
# ──────────────────────────────────────────────

clean: ## Remove build artifacts
	rm -rf client/build server/bin $(DIST_DIR)

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'