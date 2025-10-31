.PHONY: server-dev server-dev+ server-build server-test server-clean help

web-dev:
	@echo "Starting web in development mode..."
	@cd web && bun run dev

web-dev+:
	@echo "Starting web in development mode (publically accessible)..."
	@cd web && bun run dev+

web-build:
	@echo "Building web..."
	@cd web && bun run build
	@echo "Build complete"

web-preview:
	@echo "Starting web in preview mode..."
	@cd web && bun run preview

web-preview+:
	@echo "Starting web in preview mode (publically accessible)..."
	@cd web && bun run preview+

server-dev:
	@echo "Starting server in development mode..."
	@cd api && ENVIRONMENT=development go run main.go

server-dev+:
	@echo "Starting server in development mode (publicly accessible)..."
	@cd api && ENVIRONMENT=development HOST=0.0.0.0 go run main.go

server-build:
	@echo "Building server..."
	@cd api && go build -o ../bin/aframe-server main.go
	@echo "Build complete: bin/aframe-server"

server-test:
	@echo "Running server tests..."
	@cd api && go test ./tests/... -v

server-clean:
	@echo "Cleaning server build artifacts..."
	@rm -rf bin/
	@echo "Clean complete"

help:
	@echo "Available targets:"
	@echo ""
	@echo "Server:"
	@echo "  make server-dev     - Start server in development mode (localhost only)"
	@echo "  make server-dev+    - Start server in development mode (publicly accessible)"
	@echo "  make server-build   - Build server binary"
	@echo "  make server-test    - Run server tests"
	@echo "  make server-clean   - Remove server build artifacts"
	@echo ""
	@echo "General:"
	@echo "  make help           - Show this help message"
