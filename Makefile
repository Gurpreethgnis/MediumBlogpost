.PHONY: help dev build test lint format clean docker-up docker-down docker-logs seed migrate

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services in development mode
	@echo "Starting development environment..."
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	@echo "Frontend: http://localhost:6545"
	@echo "API: http://localhost:3001"
	@echo "MinIO Console: http://localhost:9001"
	@echo "PostgreSQL: localhost:15432"
	@echo "Redis: localhost:16379"

build: ## Build all services
	@echo "Building all services..."
	npm run build

test: ## Run all tests
	@echo "Running tests..."
	npm run test

lint: ## Run linting on all services
	@echo "Running linting..."
	npm run lint

format: ## Format code with Prettier
	@echo "Formatting code..."
	npm run format

clean: ## Clean up build artifacts and node_modules
	@echo "Cleaning up..."
	rm -rf web/node_modules api/node_modules worker/node_modules
	rm -rf web/build api/dist worker/dist
	rm -rf web/.next api/.next worker/.next

docker-up: ## Start Docker services
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down: ## Stop Docker services
	@echo "Stopping Docker services..."
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "Showing Docker logs..."
	docker-compose logs -f

seed: ## Seed the database with sample data
	@echo "Seeding database..."
	cd api && npm run seed

migrate: ## Run database migrations
	@echo "Running database migrations..."
	cd api && npm run migrate

setup: ## Initial setup of the project
	@echo "Setting up project..."
	npm install
	cd web && npm install
	cd api && npm install
	cd worker && npm install
	@echo "Setup complete! Run 'make dev' to start development environment"
