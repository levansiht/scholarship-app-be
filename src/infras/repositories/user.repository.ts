import { Injectable } from '@nestjs/common';
import { User, UserRole, UserStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { IRepositoryUser } from '../../core/domain/interfaces/repositories';

/**
 * UserRepository - Data access layer for User entity
 *
 * Responsibilities:
 * - Implement repository interface from domain layer
 * - Handle all database operations via Prisma
 * - Provide type-safe data access methods
 * - Encapsulate Prisma-specific logic
 */
@Injectable()
export class UserRepository implements IRepositoryUser {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email address
   */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user with all profile relations
   * Includes: profile, studentProfile, sponsorProfile
   */
  findWithProfile(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        studentProfile: true,
        sponsorProfile: true,
      },
    });
  }

  /**
   * Find all users by role
   * @param role - User role enum (STUDENT, SPONSOR, ADMIN, ADVISOR)
   */
  findByRole(role: UserRole): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
    });
  }

  /**
   * Find all users with optional filters
   * @param params - Prisma query arguments (where, include, orderBy, etc.)
   */
  findAll(params?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  /**
   * Create new user
   * @param data - User creation data with type safety
   */
  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Update existing user
   * @param data - Partial user data for update
   */
  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Count users with optional filters
   */
  count(params?: Prisma.UserCountArgs): Promise<number> {
    return this.prisma.user.count(params);
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Verify user email and activate account
   * Sets status to ACTIVE
   */
  async verifyEmail(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });
  }

  /**
   * Check if email already exists
   * Returns true if email is taken
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * Suspend user account
   * Sets status to SUSPENDED
   */
  async suspend(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.SUSPENDED },
    });
  }

  /**
   * Activate user account
   * Sets status to ACTIVE
   */
  async activate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });
  }
}
