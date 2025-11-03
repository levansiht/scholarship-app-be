# 🎓 Scholarship Management System - Backend

A scholarship management platform built with NestJS, PostgreSQL, Prisma ORM.

## � Tech Stack

- **Framework:** NestJS 10+ (Node.js 18+)
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5+
- **Authentication:** JWT + Passport
- **Validation:** Zod schemas
- **Containerization:** Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 18+
- Docker & Docker Compose
```

### 1️⃣ Installation

```bash
cd scholarship-backend

# Install dependencies
npm install
# or: make install
```

### 2️⃣ Environment Setup

```bash
# Copy environment template (defaults work for local dev)
cp .env.example .env
```

### 3️⃣ Start Database

```bash
# Start PostgreSQL, pgAdmin, Redis
make docker-up

# Or without make:
docker-compose up -d
```

### 4️⃣ Initialize Database

```bash
# One command to setup everything
make db-setup

# Or step by step:
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed demo data
```

### 5️⃣ Run Application

```bash
# Development mode with hot reload
make dev
# or: npm run start:dev

# Production mode
make build && make start
# or: npm run build && npm run start:prod
```

### 6️⃣ Access Services

| Service          | URL                            | Credentials                      |
| ---------------- | ------------------------------ | -------------------------------- |
| 🚀 API           | http://localhost:3000          | -                                |
| 📚 Swagger UI    | http://localhost:3000/api/docs | -                                |
| 🎨 Prisma Studio | http://localhost:5555          | -                                |
| 📊 pgAdmin       | http://localhost:5050          | admin@scholarship.com / admin123 |
| 🗄️ PostgreSQL    | localhost:5432                 | postgres / postgres              |

### � Demo Accounts (after seeding)

| Role    | Email                 | Password     |
| ------- | --------------------- | ------------ |
| Admin   | admin@scholarship.com | Password123! |
| Sponsor | vingroup@sponsor.com  | Password123! |
| Student | student1@gmail.com    | Password123! |

### 📖 Documentation

- **System Logic & Workflows:** `docs/SYSTEM_LOGIC.md` (Business logic cho từng role)
- **API Guide for Frontend:** `docs/API_GUIDE_FOR_FRONTEND.md` (API reference)
- **Swagger UI:** http://localhost:3000/api/docs (Interactive testing)

---

## 📖 Available Commands

### Make Commands (Recommended)

```bash
# Development
make dev            # Start dev server
make build          # Build for production
make start          # Start production server

# Docker
make docker-up      # Start all containers
make docker-down    # Stop all containers
make docker-logs    # View container logs

# Database
make db-setup       # Generate + Migrate + Seed (first time setup)
make db-generate    # Generate Prisma Client
make db-migrate     # Run migrations
make db-seed        # Seed demo data
make db-studio      # Open Prisma Studio GUI
```

### NPM Scripts

```bash
# Development
npm run start:dev          # Dev server with hot reload
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
```

---

