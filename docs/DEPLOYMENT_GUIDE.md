# Deployment Guide

## Railway Deployment

### 1. Database Migrations

Migrations run automatically on deployment via Dockerfile:

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
```

### 2. Seed Database (Manual)

**Important:** Database seeding is done manually via Railway CLI to avoid duplicate data on every deployment.

#### Install Railway CLI

```bash
brew install railway
```

#### Seed Production Database

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Run seed script on Railway database
railway run npm run prisma:seed
```

#### Seed Script Behavior

- ✅ Automatically skips if database already has users
- ✅ Creates complete sample data:
  - 1 Admin: `admin@scholarship.com / Password123!`
  - 2 Sponsors: `vingroup@sponsor.com`, `viettel@sponsor.com`
  - 3 Students: `student1@example.com`, `student2@example.com`, `student3@example.com`
  - 3 Scholarships with full details
- ✅ All users have password: `Password123!`

### 3. View Database (Optional)

```bash
# Open Prisma Studio connected to Railway database
railway run npx prisma studio
```

## Local Development

### Seed Local Database

```bash
npm run prisma:seed
```

### Reset & Reseed

```bash
npm run prisma:reset
```

This will:
1. Drop all tables
2. Run migrations
3. Seed database automatically

## Environment Variables

Required on Railway:

```env
DATABASE_URL=<provided-by-railway>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
```
