# 🎓 Scholarship Management System - Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A robust scholarship management platform built with NestJS, Clean Architecture, and SOLID principles.</p>

---

## ✨ Features

- 👤 **User Management** - Students, Sponsors, Admins with role-specific profiles
- 🎓 **Scholarship CRUD** - Complete lifecycle management
- 📄 **Application System** - Submit, review, and track applications
- 🔔 **Notifications** - Real-time updates
- 💬 **Messaging** - Direct communication
- 🔍 **Advanced Search** - Filter and discover scholarships
- 🔐 **Security** - JWT authentication, password hashing, email verification
- 📁 **File Management** - Document uploads with validation

## 🏗️ Architecture

Built with **Clean Architecture** principles:

```
src/
├── core/                    # 🎯 Domain Layer
│   ├── domain/
│   │   ├── entities/       # Business models
│   │   └── interfaces/     # Repository contracts
│   └── application/
│       └── use-cases/      # Business logic
│
├── infras/                 # 🔧 Infrastructure Layer
│   ├── database/          # Prisma + PostgreSQL
│   └── repositories/      # Data access implementations
│
├── modules/               # 🌐 Presentation Layer
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   └── scholarships/     # Scholarship features
│
└── common/               # 🛠️ Shared utilities
    ├── decorators/
    ├── exceptions/
    └── interceptors/
```

**Database:** 21 tables covering users, scholarships, applications, communication, and audit logging.

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

| Role       | Email                 | Password     |
| ---------- | --------------------- | ------------ |
| 👨‍💼 Admin   | admin@scholarship.com | Password123! |
| 🏢 Sponsor | vingroup@sponsor.com  | Password123! |
| 🎓 Student | student1@gmail.com    | Password123! |

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

- 📖 [Getting Started Guide](./docs/GETTING_STARTED.md) - Detailed setup
- 🗄️ [Database Schema](./docs/DATABASE_SCHEMA.md) - Complete schema
- 📊 [Database Summary](./docs/DATABASE_SUMMARY.md) - Quick overview
- ✅ [Phase 2 Complete](./docs/PHASE_2_COMPLETE.md) - Infrastructure layer

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

- **Framework:** NestJS 11
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6
- **Cache:** Redis
- **Authentication:** JWT + Passport
- **Validation:** class-validator
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose

---

## 📂 Project Status

### ✅ Completed

- ✅ Phase 1: Database Foundation (21 tables, migrations, seed data)
- ✅ Phase 2: Infrastructure Layer (Repository pattern, DI, tests)

### 🚧 In Progress

- 🔄 Phase 3: Domain Layer (Entities, Value Objects, Events)
- 🔄 Phase 4: Application Layer (Use Cases, DTOs)
- 🔄 Phase 5: Presentation Layer (Controllers, Guards, Pipes)

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
