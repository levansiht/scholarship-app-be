# 🚀 Quick Start Guide

## One-Command Setup (First Time)

```bash
make setup
```

This will:

1. ✅ Install dependencies
2. ✅ Start Docker containers
3. ✅ Generate Prisma Client
4. ✅ Run migrations
5. ✅ Seed demo data

## Manual Setup

### Step 1: Install Dependencies

```bash
make install
# or: npm install
```

### Step 2: Start Docker

```bash
make docker-up
```

### Step 3: Setup Database

```bash
make db-setup
```

### Step 4: Start Development Server

```bash
make dev
```

## Access Your Application

| Service          | URL                   | Credentials                      |
| ---------------- | --------------------- | -------------------------------- |
| 🚀 API           | http://localhost:3000 | -                                |
| 📊 pgAdmin       | http://localhost:5050 | admin@scholarship.com / admin123 |
| 🎨 Prisma Studio | Run `make db-studio`  | -                                |

## Demo Users

| Role    | Email                 | Password     |
| ------- | --------------------- | ------------ |
| Admin   | admin@scholarship.com | Password123! |
| Sponsor | vingroup@sponsor.com  | Password123! |
| Student | student1@gmail.com    | Password123! |

## Common Commands

```bash
# Development
make dev              # Start dev server
make test             # Run tests

# Docker
make docker-logs      # View logs
make docker-down      # Stop containers

# Database
make db-studio        # Open Prisma Studio
make db-seed          # Reseed data

# See all commands
make help
```

## Troubleshooting

### Port Already in Use

```bash
# Stop all containers
make docker-down

# Check what's using the port
lsof -i :3000
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database Connection Error

```bash
# Restart containers
make docker-down
make docker-up

# Check container status
docker ps
```

### Prisma Client Out of Sync

```bash
# Regenerate client
make db-generate
```

## Next Steps

- 📖 Read [Getting Started Guide](./GETTING_STARTED.md)
- 🗄️ Check [Database Schema](./DATABASE_SCHEMA.md)
- ✅ See [Phase 2 Complete](./PHASE_2_COMPLETE.md)

Happy coding! 🎉
