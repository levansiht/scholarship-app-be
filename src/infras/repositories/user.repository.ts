import { Injectable } from '@nestjs/common';
import { UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IRepositoryUser,
  PaginationParams,
  PaginatedResult,
} from '../../core/domain/interfaces/repositories';
import { User } from '../../core/domain/entities';
import { UserMapper } from '../../core/domain/mappers';
import { CreateUserDto, UpdateUserDto } from '../../core/domain/dtos';

@Injectable()
export class UserRepository implements IRepositoryUser {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findWithProfile(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        studentProfile: true,
        sponsorProfile: true,
      },
    });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async findByRole(role: string): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: { role: role as UserRole },
    });
    return UserMapper.toDomainArray(prismaUsers);
  }
  async findAll(params?: PaginationParams): Promise<PaginatedResult<User>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [prismaUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: params?.sortBy
          ? { [params.sortBy]: params.sortOrder ?? 'asc' }
          : undefined,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: UserMapper.toDomainArray(prismaUsers),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(dto: CreateUserDto): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        role: dto.role as UserRole,
      },
    });
    return UserMapper.toDomain(prismaUser);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        password: dto.password,
        status: dto.status,
      },
    });
    return UserMapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  count(params?: Prisma.UserCountArgs): Promise<number> {
    return this.prisma.user.count(params);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return UserMapper.toDomain(prismaUser);
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}
