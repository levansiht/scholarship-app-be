# Scholarship Management System - Makefile
# Quick commands for development workflow

.PHONY: help install docker-up docker-down docker-logs docker-clean db-generate db-migrate db-seed db-studio db-reset dev build start test lint format clean

# Default target
help:
	@echo "📚 Available Commands:"
	@echo ""
	@echo "🚀 Quick Start:"
	@echo "  make install        - Install dependencies"
	@echo "  make docker-up      - Start Docker containers"
	@echo "  make db-setup       - Setup database (generate + migrate + seed)"
	@echo "  make dev            - Start development server"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make docker-up      - Start all containers"
	@echo "  make docker-down    - Stop all containers"
	@echo "  make docker-logs    - View container logs"
	@echo "  make docker-clean   - Remove containers and volumes"
	@echo ""
	@echo "🗄️  Database:"
	@echo "  make db-generate    - Generate Prisma Client"
	@echo "  make db-migrate     - Run migrations"
	@echo "  make db-seed        - Seed database with demo data"
	@echo "  make db-studio      - Open Prisma Studio"
	@echo "  make db-reset       - Reset database (⚠️  destructive!)"
	@echo "  make db-setup       - Full setup (generate + migrate + seed)"
	@echo ""
	@echo "💻 Development:"
	@echo "  make dev            - Start dev server"
	@echo "  make build          - Build for production"
	@echo "  make start          - Start production server"
	@echo "  make test           - Run tests"
	@echo "  make test-e2e       - Run E2E tests"
	@echo "  make lint           - Run linter"
	@echo "  make format         - Format code"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean          - Remove node_modules and build files"

# Installation
install:
	@echo "📦 Installing dependencies..."
	npm install

# Docker commands
docker-up:
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d
	@echo "✅ Containers started!"
	@echo "📊 pgAdmin: http://localhost:5050 (admin@scholarship.com / admin123)"
	@echo "🗄️  PostgreSQL: localhost:5432 (postgres / postgres)"

docker-down:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down

docker-logs:
	@echo "📋 Viewing container logs..."
	docker-compose logs -f

docker-clean:
	@echo "🧹 Cleaning Docker resources..."
	docker-compose down -v
	@echo "✅ All containers and volumes removed!"

# Database commands
db-generate:
	@echo "⚙️  Generating Prisma Client..."
	npx prisma generate

db-migrate:
	@echo "🔄 Running database migrations..."
	npx prisma migrate dev

db-seed:
	@echo "🌱 Seeding database with demo data..."
	npx prisma db seed

db-studio:
	@echo "🎨 Opening Prisma Studio..."
	npx prisma studio

db-reset:
	@echo "⚠️  Resetting database (this will delete all data)..."
	npx prisma migrate reset --force

db-setup: db-generate db-migrate db-seed
	@echo "✅ Database setup complete!"

# Development commands
dev:
	@echo "🚀 Starting development server..."
	npm run start:dev

build:
	@echo "🏗️  Building for production..."
	npm run build

start:
	@echo "▶️  Starting production server..."
	npm run start:prod

test:
	@echo "🧪 Running tests..."
	npm run test

test-e2e:
	@echo "🧪 Running E2E tests..."
	npm run test:e2e

test-cov:
	@echo "📊 Running tests with coverage..."
	npm run test:cov

lint:
	@echo "🔍 Running linter..."
	npm run lint

format:
	@echo "✨ Formatting code..."
	npm run format

# Cleanup
clean:
	@echo "🧹 Cleaning project..."
	rm -rf node_modules dist .next
	@echo "✅ Cleanup complete!"

# Complete setup (for first time)
setup: install docker-up db-setup
	@echo ""
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║           ✅ Setup Complete! Ready to develop! 🚀            ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "📝 Next steps:"
	@echo "  1. Run: make dev"
	@echo "  2. Visit: http://localhost:3000"
	@echo "  3. pgAdmin: http://localhost:5050"
	@echo ""
