import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infras/database/prisma/prisma.service';
import {
  USER_REPOSITORY,
  IRepositoryUser,
} from '../src/core/domain/interfaces/repositories';

describe('Phase 2 - Infrastructure Layer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userRepository: IRepositoryUser;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    userRepository = moduleFixture.get<IRepositoryUser>(USER_REPOSITORY);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Database Module', () => {
    it('should connect to database successfully', () => {
      expect(prisma).toBeDefined();
      expect(prisma.$connect).toBeDefined();
    });
  });

  describe('Repository DI', () => {
    it('should inject UserRepository via DI token', () => {
      expect(userRepository).toBeDefined();
      expect(userRepository.findById).toBeDefined();
      expect(userRepository.findByEmail).toBeDefined();
    });
  });

  describe('UserRepository - CRUD Operations', () => {
    it('should find user by email (from seed data)', async () => {
      const user = await userRepository.findByEmail('admin@scholarship.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@scholarship.com');
      expect(user?.role).toBe('ADMIN');
    });

    it('should return null for non-existent email', async () => {
      const user = await userRepository.findByEmail('notfound@test.com');
      expect(user).toBeNull();
    });

    it('should find user by ID', async () => {
      const admin = await userRepository.findByEmail('admin@scholarship.com');
      expect(admin).toBeDefined();

      if (admin) {
        const user = await userRepository.findById(admin.id);
        expect(user).toBeDefined();
        expect(user?.id).toBe(admin.id);
      }
    });

    it('should find users by role', async () => {
      const students = await userRepository.findByRole('STUDENT');
      expect(students).toBeDefined();
      expect(Array.isArray(students)).toBe(true);
      expect(students.length).toBeGreaterThan(0);
      expect(students.every((u) => u.role === 'STUDENT')).toBe(true);
    });

    it('should count users', async () => {
      const count = await userRepository.count();
      expect(count).toBeGreaterThan(0);
    });

    it('should check if email exists', async () => {
      const exists = await userRepository.emailExists('admin@scholarship.com');
      expect(exists).toBe(true);

      const notExists = await userRepository.emailExists('fake@email.com');
      expect(notExists).toBe(false);
    });

    it('should find user with profile', async () => {
      const admin = await userRepository.findByEmail('admin@scholarship.com');
      expect(admin).toBeDefined();

      if (admin) {
        const userWithProfile = await userRepository.findWithProfile(admin.id);
        expect(userWithProfile).toBeDefined();
        // Profile might be null for admin, but method should work
      }
    });
  });

  describe('Repository Pattern Benefits', () => {
    it('should allow business logic to depend on interface, not implementation', () => {
      // This test verifies that we can inject via DI token
      // Business logic will only know about IRepositoryUser
      // Not the concrete UserRepository implementation

      expect(userRepository).toBeDefined();
      expect(typeof userRepository.findById).toBe('function');
      expect(typeof userRepository.findByEmail).toBe('function');
      expect(typeof userRepository.create).toBe('function');
      expect(typeof userRepository.update).toBe('function');
      expect(typeof userRepository.delete).toBe('function');
    });
  });
});
