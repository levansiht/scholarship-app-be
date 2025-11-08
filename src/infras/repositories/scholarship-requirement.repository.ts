import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IScholarshipRequirementRepository,
  CreateRequirementData,
  UpdateRequirementData,
} from '../../core/domain/interfaces/repositories/scholarship-requirement.repository.interface';
import { ScholarshipRequirement } from '../../core/domain/entities/scholarship-requirement.entity';
import { ScholarshipRequirementMapper } from '../../core/domain/mappers/scholarship-requirement.mapper';

@Injectable()
export class ScholarshipRequirementRepository
  implements IScholarshipRequirementRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRequirementData): Promise<ScholarshipRequirement> {
    const requirement = await this.prisma.scholarshipRequirement.create({
      data: {
        scholarshipId: data.scholarshipId,
        title: data.title,
        description: data.description,
        isRequired: data.isRequired ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });

    const domainRequirement =
      ScholarshipRequirementMapper.toDomain(requirement);
    if (!domainRequirement) {
      throw new Error('Failed to map requirement to domain');
    }

    return domainRequirement;
  }

  async findById(id: string): Promise<ScholarshipRequirement | null> {
    const requirement = await this.prisma.scholarshipRequirement.findUnique({
      where: { id },
    });

    return requirement
      ? ScholarshipRequirementMapper.toDomain(requirement)
      : null;
  }

  async findByScholarshipId(
    scholarshipId: string,
  ): Promise<ScholarshipRequirement[]> {
    const requirements = await this.prisma.scholarshipRequirement.findMany({
      where: { scholarshipId },
      orderBy: { displayOrder: 'asc' },
    });

    return requirements
      .map((req) => ScholarshipRequirementMapper.toDomain(req))
      .filter((req): req is ScholarshipRequirement => req !== null);
  }

  async update(
    id: string,
    data: UpdateRequirementData,
  ): Promise<ScholarshipRequirement> {
    const requirement = await this.prisma.scholarshipRequirement.findUnique({
      where: { id },
    });

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    const updated = await this.prisma.scholarshipRequirement.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        isRequired: data.isRequired,
        displayOrder: data.displayOrder,
      },
    });

    const domainRequirement = ScholarshipRequirementMapper.toDomain(updated);
    if (!domainRequirement) {
      throw new Error('Failed to map updated requirement to domain');
    }

    return domainRequirement;
  }

  async delete(id: string): Promise<void> {
    const requirement = await this.prisma.scholarshipRequirement.findUnique({
      where: { id },
    });

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    await this.prisma.scholarshipRequirement.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.scholarshipRequirement.count({
      where: { id },
    });

    return count > 0;
  }
}
