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
	@echo "  api-run        - run API with compiled binary (localhost only)"
	@echo "  api-run+       - run API with compiled binary on 0.0.0.0"
	@echo "  api-test       – run Go tests"
	@echo "  web-deps       – install bun dependencies"
	@echo "  web-dev        – start Vite dev server (localhost only)"
	@echo "  web-dev+       – start Vite dev server on 0.0.0.0"
	@echo "  web-build      – production build of the UI"
	@echo "  web-preview    – preview built UI (localhost only)"
	@echo "  web-preview+   – preview built UI on 0.0.0.0"
	@echo "  web-test       – run frontend test suite"
	@echo "  dev            – run API + web dev servers concurrently (localhost only)"
	@echo "  dev+           – run API + web dev servers concurrently on 0.0.0.0"
	@echo "  start          – build both and serve production UI"
	@echo "  clean          – remove all generated files"
	@echo "  help           – show this help"

# ==== API (backend) targets ======================================
.PHONY: api-build api-clean api-deps api-dev api-preview api-test

api-build: api-prod-deps
	@set -a && . ./env/api.prod.env && set +a && cd api && $(GO) build -o bin/$(BINARY) ./cmd/api/main.go

api-clean:
	@rm -f ./api/bin/$(BINARY)

api-dev-deps:
	@if [ ! -f "./env/api.dev.env" ]; then \
		echo "api.dev.env file is missing. use the following command then edit"; \
		echo "the environment variables as neded."; \
		echo ""; \
		echo "cp env/api.env.example env/api.dev.env"; \
		echo ""; \
		exit 0; \
	fi
	@set -a && . ./env/api.dev.env && set +a && cd api && $(GO) mod download

api-prod-deps:
	@if [ ! -f "./env/api.prod.env" ]; then \
		echo "api.prod.env file is missing. use the following command then edit"; \
		echo "the environment variables as neded."; \
		echo ""; \
		echo "cp env/api.env.example env/api.prod.env"; \
		echo ""; \
		exit 0; \
	fi
	@set -a && . ./env/api.dev.env && set +a && cd api && $(GO) mod download

api-test-deps:
	@if [ ! -f "./env/api.test.env" ]; then \
		echo "api.test.env file is missing. use the following command then edit"; \
		echo "the environment variables as neded."; \
		echo ""; \
		echo "cp env/api.env.example env/api.test.env"; \
		echo ""; \
		exit 0; \
	fi
	@set -a && . ./env/api.dev.env && set +a && cd api && $(GO) mod download
api-dev: api-dev-deps
	@set -a && . ./env/api.dev.env && set +a && cd api && $(GO) run ./cmd/api/main.go

api-preview: api-build
	@set -a && . ./env/api.prod.env && set +a && cd api && ./bin/$(BINARY)

api-test: api-test-deps
	@echo -n "🔍 Checking for gotestsum"
	@if ! command -v gotestsum >/dev/null 2>&1; then \
		echo ""; \
		echo "gotestsum is not installed."; \
		echo "   Install it with:"; \
		echo "       go install github.com/gotestyourself/gotestsum@latest"; \
		exit 1; \
	else \
		echo " ☑ installed"; \
	fi
	@set -a && . ./env/api.test.env && set +a && cd api && gotestsum --format testname -- ./...

# ==== WEB (frontend) targets =====================================
.PHONY: web-clean web-clean web-deps web-dev web-dev+ web-preview web-test

web-build: web-deps
	@set -a && . ./env/web.prod.env && set +a && cd web && $(BUN_RUN) build

web-clean:
	@rm -rf web/node_modules web/dist

web-deps:
	@set -a && . ./env/web.dev.env && set +a && cd web && $(BUN) install

web-dev: web-deps
	@set -a && . ./env/web.dev.env && set +a && cd web && $(BUN_RUN) dev

web-dev+: web-deps
	@set -a && . ./env/web.dev.env && set +a && cd web && $(BUN_RUN) dev --host 0.0.0.0

web-preview: web-build
	@set -a && . ./env/web.prod.env && set +a && cd web && $(BUN_RUN) preview

web-preview+: web-build
	@set -a && . ./env/web.prod.env && set +a && cd web && $(BUN_RUN) preview --host 0.0.0.0

web-test:
	@set -a && . ./env/web.test.env && set +a && cd web && $(BUN_RUN) test

# ==== Convenience targets =========================================
.PHONY: clean dev dev+ preview preview+

clean: api-clean web-clean
	@echo "🚀 All build artifacts removed"

dev:
	@echo "🚀 Starting API and Web dev servers..."
	@$(MAKE) api-dev &
	@$(MAKE) web-dev &
	@wait # block until *both* child jobs finish

dev+:
	@echo "🚀 Starting API and Web dev servers..."
	@$(MAKE) api-dev &
	@$(MAKE) web-dev+ &
	@wait # block until *both* child jobs finish

preview: api-build web-build
	@echo "🚀 Starting API and Web preview+ servers..."
	@$(MAKE) api-preview &
	@$(MAKE) web-preview &
	@wait # block until *both* child jobs finish

preview+: api-build web-build
	@echo "🚀 Starting API and Web preview+ servers..."
	@$(MAKE) api-preview &
	@$(MAKE) web-preview+ &
	@wait # block until *both* child jobs finish
