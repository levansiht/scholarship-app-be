# 🚀 Quick Start Guide - Database Setup

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ installed
- Git

---

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env if needed (default values should work for local development)
```

### 3. Start Docker Containers

```bash
# Start PostgreSQL, pgAdmin, and Redis
make docker-up

# Or without Make
docker-compose up -d

# Check if containers are running
docker-compose ps
```

Expected output:

```
NAME                   STATUS    PORTS
scholarship-db         Up        0.0.0.0:5432->5432/tcp
scholarship-pgadmin    Up        0.0.0.0:5050->80/tcp
scholarship-redis      Up        0.0.0.0:6379->6379/tcp
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

This will:

- Read `prisma/schema.prisma`
- Generate TypeScript types
- Create Prisma Client in `node_modules/@prisma/client`

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

You'll be asked to name the migration, for example:

```
✔ Enter a name for the new migration: … initial_schema
```

This will:

- Create migration files in `prisma/migrations/`
- Apply schema to database
- Create all tables, indexes, and constraints

### 6. Seed Demo Data

```bash
npm run prisma:seed
```

This will create:

- **1 Admin user**: `admin@scholarship.com` / `Password123!`
- **2 Sponsor users**:
  - `vingroup@sponsor.com` / `Password123!`
  - `viettel@sponsor.com` / `Password123!`
- **3 Student users**:
  - `student1@gmail.com` / `Password123!`
  - `student2@gmail.com` / `Password123!`
  - `student3@gmail.com` / `Password123!`
- **3 Scholarships** (with different statuses)
- **3 Applications** (with different statuses)
- **Sample notifications**

### 7. Verify Database

#### Option A: Using Prisma Studio (Recommended)

```bash
npm run prisma:studio
```

Open http://localhost:5555 to browse your database with a nice GUI.

#### Option B: Using pgAdmin

1. Open http://localhost:5050
2. Login with:
   - Email: `admin@scholarship.com`
   - Password: `admin123`
3. Add server:
   - Name: `Scholarship DB`
   - Host: `postgres` (container name)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `scholarship_db`

#### Option C: Using PostgreSQL CLI

```bash
docker exec -it scholarship-db psql -U postgres -d scholarship_db

# List tables
\dt

# Query users
SELECT id, email, role FROM users;

# Exit
\q
```

---

## 🧪 Testing Database Connection

Create a test file to verify connection:

```typescript
// test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const scholarshipCount = await prisma.scholarship.count();

  console.log('✅ Database connection successful!');
  console.log(`📊 Users: ${userCount}`);
  console.log(`🎓 Scholarships: ${scholarshipCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:

```bash
npx ts-node test-db.ts
```

---

## 🎯 Next Steps

Now that your database is ready, you can:

1. **Create Database Module**

   ```bash
   nest g module infras/database
   nest g service infras/database
   ```

2. **Create Repository Implementations**

   ```bash
   nest g service infras/repositories/user-repository
   nest g service infras/repositories/scholarship-repository
   ```

3. **Start Building Features**
   - Auth module (JWT, Guards)
   - User module (Profile management)
   - Scholarship module (CRUD)
   - Application module (Submit, Review)

---

## 🔧 Common Commands Reference

### Docker

```bash
make docker-up           # Start containers
make docker-down         # Stop containers
make docker-logs         # View logs
make docker-clean        # Remove everything
make docker-restart      # Restart containers
```

### Prisma

```bash
npm run prisma:generate          # Generate client
npm run prisma:migrate           # Create & run migration
npm run prisma:migrate:deploy    # Deploy migrations (production)
npm run prisma:studio            # Open Prisma Studio
npm run prisma:seed              # Seed database
npm run prisma:reset             # Reset database (destructive!)
```

### Database Backup

```bash
make db-backup                          # Create backup
make db-restore FILE=backup_xxx.sql     # Restore from backup
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

```bash
# Check if PostgreSQL is running
docker ps | grep scholarship-db

# Check logs
docker logs scholarship-db

# Restart container
docker restart scholarship-db
```

### Error: "Prisma Client not generated"

```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Error: "Migration failed"

```bash
# Reset database and start over
npm run prisma:reset

# Or manually drop database
docker exec -it scholarship-db psql -U postgres -c "DROP DATABASE scholarship_db;"
docker exec -it scholarship-db psql -U postgres -c "CREATE DATABASE scholarship_db;"

# Run migrations again
npm run prisma:migrate
```

### Port 5432 already in use

```bash
# Find what's using the port
lsof -i :5432

# Kill the process or change port in docker-compose.yml
```

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)
- [Database Schema Docs](./DATABASE_SCHEMA.md)
- [Docker Setup Guide](../README.Docker.md)

---

## ✅ Checklist

- [ ] Docker containers running
- [ ] Environment variables configured
- [ ] Prisma Client generated
- [ ] Migrations applied
- [ ] Database seeded
- [ ] Connection verified (Prisma Studio or pgAdmin)
- [ ] Ready to start building! 🚀
