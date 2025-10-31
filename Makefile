# ────────────────────────────────────────────────────────────────────────
#  Top‑level Makefile – API (Go) + Web (React/TS) using bun
# ────────────────────────────────────────────────────────────────────────

# ==== VARIABLES ==================================================
GO      ?= go
GOFLAGS ?=
BINARY  ?= api

# Bun (JavaScript/TypeScript) variables
BUN     ?= bun
BUN_RUN ?= $(BUN) run

MAKEFLAGS += -j2

# ==== HELP =======================================================
.PHONY: help
help:
	@echo
	@echo "Makefile targets:"
	@echo "  api-deps       – download Go module dependencies"
	@echo "  api-build      – compile the API binary"
	@echo "  api-dev        – run API in development mode"
	@echo "  api-dev+       – run API in development mode on 0.0.0.0"
	@echo "  api-test       – run Go tests"
	@echo "  web-deps       – install bun dependencies"
	@echo "  web-dev        – start Vite dev server (localhost only)"
	@echo "  web-dev+       – start Vite dev server on 0.0.0.0"
	@echo "  web-build      – production build of the UI"
	@echo "  web-preview    – preview built UI (localhost only)"
	@echo "  web-preview+   – preview built UI on 0.0.0.0"
	@echo "  web-test       – run frontend test suite"
	@echo "  dev            – run API + web dev servers concurrently"
	@echo "  start          – build both and serve production UI"
	@echo "  clean          – remove all generated files"
	@echo "  help           – show this help"

# ==== API (backend) targets ======================================
.PHONY: api-deps api-build api-dev api-dev+ api-clean api-test

api-deps:
	@echo -n "🔍 Checking for gotestsum"
	@if ! command -v gotestsum >/dev/null 2>&1; then \
		echo ""; \
		echo "❗ gotestsum is not installed."; \
		echo "   Install it with:"; \
		echo "       go install github.com/gotestyourself/gotestsum@latest"; \
		exit 1; \
	else \
		echo " ☑ installed"; \
	fi
	@cd api && $(GO) mod download
	@echo "all packages ☑ installed"

api-build: api-deps
	@cd api && $(GO) build -o bin/$(BINARY) ./cmd/api/main.go

api-dev: api-deps
	@cd api && $(GO) run ./cmd/api/main.go

api-dev+: api-deps
	@cd api && HOST=0.0.0.0 $(GO) run ./cmd/api/main.go

api-clean:
	@rm -f ./api/bin/$(BINARY)

api-run: api-build
	@cd api && ./bin/$(BINARY)

api-run+: api-build
	@cd api && HOST=0.0.0.0 ./bin/$(BINARY)

api-test:
	@cd api && gotestsum --format testname -- ./...

# ==== WEB (frontend) targets =====================================
.PHONY: web-deps web-dev web-dev+ web-build web-preview web-preview+ web-clean web-test

web-deps:
	@cd web && $(BUN) install

# Development server – localhost only (default)
web-dev: web-deps
	@cd web && $(BUN_RUN) dev


# Development server – listen on all interfaces (0.0.0.0)
web-dev+: web-deps
	@cd web && $(BUN_RUN) dev --host 0.0.0.0

# Production build
web-build: web-deps
	@cd web && $(BUN_RUN) build

# Preview the production build (localhost only)
web-preview: web-build
	@cd web && $(BUN_RUN) preview

# Preview the production build on all interfaces
web-preview+: web-build
	@cd web && $(BUN_RUN) preview --host 0.0.0.0

web-clean:
	@rm -rf web/node_modules web/dist

# Run web test suite (assumes a "test" script in package.json)
web-test:
	@cd web && $(BUN_RUN) test

# ==== Convenience targets =========================================
.PHONY: dev start clean

# Run both API and web dev servers concurrently
dev:
	@echo "🚀 Starting API and Web dev servers..."
	@$(MAKE) api-dev &    # launch API in background
	@$(MAKE) web-dev &    # launch Web in background
	@wait                 # block until *both* child jobs finish

# Run both API and web dev servers concurrently (0.0.0.0)
dev+:
	@echo "🚀 Starting API and Web dev servers..."
	@$(MAKE) api-dev+ &    # launch API in background
	@$(MAKE) web-dev+ &    # launch Web in background
	@wait                 # block until *both* child jobs finish

# Build both and serve the production UI (good for Docker / prod)
start: api-build web-build
	@echo "🚀 Starting API and Web preview servers..."
	@$(MAKE) api-run &    # launch API in background
	@$(MAKE) web-preview &    # launch Web in background
	@wait                 # block until *both* child jobs finish

# Build both and serve the production UI (good for Docker / prod) (0.0.0.0)
start+: api-build web-build
	@echo "🚀 Starting API and Web preview+ servers..."
	@$(MAKE) api-run+ &    # launch API in background
	@$(MAKE) web-preview+ &    # launch Web in background
	@wait                 # block until *both* child jobs finish

# Clean everything
clean: api-clean web-clean
	@echo "🚀 All build artifacts removed"
