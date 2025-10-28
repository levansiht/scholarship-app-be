import { User as PrismaUser } from '@prisma/client';
import { User, UserRole, UserStatus } from '../entities';
import { Email, Password } from '../value-objects';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      password: Password.createHashed(prismaUser.password),
      role: prismaUser.role as UserRole,
      status: prismaUser.status as UserStatus,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomainArray(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}
