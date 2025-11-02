# 🎓 Scholarship Management System - Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A production-ready scholarship management platform built with NestJS, CQRS, Clean Architecture, and SOLID principles.</p>

---

## ✨ Features

- 👤 **User Management** - RBAC with STUDENT, SPONSOR, ADMIN roles
- 🎓 **Scholarship CRUD** - Complete lifecycle with ownership validation
- 📄 **Application System** - Submit, review, approve/reject with business rules
- � **Security** - JWT authentication, bcrypt password hashing, role guards
- � **CQRS Pattern** - Separated read/write operations with command handlers
- ✅ **Enhanced Validation** - Zod schemas with cross-field validation
- �️ **PostgreSQL + Prisma** - Type-safe database access with migrations

## 🏗️ Architecture

Built with **Clean Architecture + CQRS Pattern**:

```
src/
├── core/                           # 🎯 Domain Layer
│   ├── domain/
│   │   ├── entities/              # Domain models
│   │   ├── dtos/                  # Zod validation schemas
│   │   └── interfaces/            # Repository contracts
│   └── application/
│       ├── commands/              # Write operations (CQRS)
│       │   ├── user/
│       │   ├── scholarship/
│       │   └── application/
│       └── queries/               # Read operations (CQRS)
│
├── infras/                        # 🔧 Infrastructure Layer
│   ├── database/                  # Prisma ORM
│   ├── repositories/              # Data access
│   └── auth/                      # JWT strategy & guards
│
├── presentation/                  # 🌐 Presentation Layer
│   └── http/
│       ├── controllers/           # REST endpoints
│       ├── dtos/                  # API request/response
│       └── modules/               # NestJS modules
│
└── shared/                        # 🛠️ Shared utilities
    └── constants/                 # Enums, messages, validation
```

**Database:** 3 core tables (User, Scholarship, Application) with optimized indexes.

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 18+
- Docker & Docker Compose
```

### 1️⃣ Installation

```bash
# Clone repository
git clone <repository-url>
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

| Service          | URL                   | Credentials                      |
| ---------------- | --------------------- | -------------------------------- |
| 🚀 API           | http://localhost:3000 | -                                |
| 🎨 Prisma Studio | http://localhost:5555 | -                                |
| 📊 pgAdmin       | http://localhost:5050 | admin@scholarship.com / admin123 |
| 🗄️ PostgreSQL    | localhost:5432        | postgres / postgres              |
| 🔴 Redis         | localhost:6379        | Password: redis123               |

### 🔐 Demo Login

| Role        | Email                 | Password     |
| ----------- | --------------------- | ------------ |
| 👨‍💼 Admin    | admin@scholarship.com | Password123! |
| 🏢 Sponsor  | vingroup@sponsor.com  | Password123! |
| � Sponsor   | viettel@sponsor.com   | Password123! |
| �🎓 Student | student1@gmail.com    | Password123! |
| 🎓 Student  | student2@gmail.com    | Password123! |
| 🎓 Student  | student3@gmail.com    | Password123! |

### 📖 API Documentation

- **Swagger UI:** http://localhost:3000/api/docs (Interactive API testing)
- **API Docs:** `docs/API_DOCUMENTATION.md` (Complete reference for frontend)
- **Database Docs:** `docs/DATABASE_DOCUMENTATION.md` (Schema, relationships, queries)

---

## 📖 Commands Reference

### Development

```bash
make dev            # Start dev server
make build          # Build for production
make start          # Start production server
make test           # Run unit tests
make test-e2e       # Run E2E tests
make lint           # Run ESLint
make format         # Format with Prettier
```

### Docker

```bash
make docker-up      # Start containers
make docker-down    # Stop containers
make docker-logs    # View logs
make docker-clean   # Remove all containers & volumes
```

### Database

```bash
make db-generate    # Generate Prisma Client
make db-migrate     # Run migrations
make db-seed        # Seed demo data
make db-studio      # Open Prisma Studio GUI
make db-reset       # Reset database (⚠️ destructive!)
make db-setup       # Full setup (generate + migrate + seed)
```

### NPM Scripts

```bash
npm run start:dev          # Dev server with hot reload
npm run start:debug        # Dev server with debugger
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Create & run migrations
npm run prisma:studio      # Open Prisma Studio
npm run prisma:seed        # Seed database
npm run test               # Unit tests
npm run test:watch         # Test watch mode
npm run test:cov           # Test coverage
npm run test:e2e           # E2E tests
npm run lint               # Lint code
npm run format             # Format code
```

---

## 📚 Documentation

- 📖 **API Documentation** - `docs/API_DOCUMENTATION.md` - All endpoints for frontend integration
- 🗄️ **Database Documentation** - `docs/DATABASE_DOCUMENTATION.md` - Schema, relationships, migrations
- 🎯 **Swagger UI** - http://localhost:3000/api/docs - Interactive API testing
- ✅ **Phase 10 Complete** - `docs/PHASE_10_COMPLETE.md` - Latest improvements

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 🛠️ Tech Stack

- **Framework:** NestJS 10+
- **Language:** TypeScript (strict mode)
- **Architecture:** Clean Architecture + CQRS Pattern
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 5+
- **Authentication:** JWT + Passport
- **Validation:** Zod schemas
- **Password:** bcrypt (10 salt rounds)
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose

---

## 📂 Project Status

### ✅ Completed Phases

- ✅ **Phase 1-7**: Database, Infrastructure, Domain, Application, Presentation Layers
- ✅ **Phase 8**: JWT Authentication (login, register, password hashing)
- ✅ **Phase 9**: RBAC with SPONSOR role + ownership validation
- ✅ **Phase 10**: Enhanced validation, seed data, professional documentation

### 🎯 Next Phase

- � **Phase 11**: Deployment (Heroku/Railway/Render), CI/CD, monitoring, security hardening

### 📊 Current Status

- **Total Endpoints:** 21 (Auth: 2, Users: 6, Scholarships: 7, Applications: 6)
- **Database Tables:** 3 (User, Scholarship, Application)
- **Seed Data:** 6 users, 3 scholarships, 3 applications
- **Build Status:** ✅ Passing (0 TypeScript errors)
- **Documentation:** ✅ Complete (API + Database docs for frontend team)

---

## 🤝 Contributing

```bash
# Fork the repository
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

## 🌟 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

<p align="center">Made with ❤️ using NestJS</p>
