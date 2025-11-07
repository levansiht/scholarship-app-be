import { Injectable } from '@nestjs/common';
import {
  IEligibilityCriteriaRepository,
  SetCriteriaData,
  UpdateCriteriaData,
} from '../../core/domain/interfaces/repositories';
import { EligibilityCriteria } from '../../core/domain/entities';
import { PrismaService } from '../database/prisma/prisma.service';
import { EligibilityCriteriaMapper } from '../../core/domain/mappers/eligibility-criteria.mapper';

@Injectable()
export class EligibilityCriteriaRepository
  implements IEligibilityCriteriaRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async set(data: SetCriteriaData): Promise<EligibilityCriteria> {
    // Delete existing criteria for this scholarship
    await this.prisma.eligibilityCriteria.deleteMany({
      where: { scholarshipId: data.scholarshipId },
    });

    // Create new criteria
    const now = new Date();
    const criteria = EligibilityCriteria.create({
      id: crypto.randomUUID(),
      scholarshipId: data.scholarshipId,
      minGpa: data.minGpa,
      maxGpa: data.maxGpa,
      allowedMajors: data.allowedMajors ?? [],
      allowedYearOfStudy: data.allowedYearOfStudy ?? [],
      minAge: data.minAge,
      maxAge: data.maxAge,
      requiredNationality: data.requiredNationality,
      otherRequirements: data.otherRequirements,
      createdAt: now,
      updatedAt: now,
    });

    const prismaCriteria = await this.prisma.eligibilityCriteria.create({
      data: EligibilityCriteriaMapper.toPrisma(criteria),
    });

    return EligibilityCriteriaMapper.toDomain(prismaCriteria);
  }

  async findByScholarshipId(
    scholarshipId: string,
  ): Promise<EligibilityCriteria | null> {
    const criteria = await this.prisma.eligibilityCriteria.findFirst({
      where: { scholarshipId },
    });

    if (!criteria) {
      return null;
    }

    return EligibilityCriteriaMapper.toDomain(criteria);
  }

  async update(
    scholarshipId: string,
    data: UpdateCriteriaData,
  ): Promise<EligibilityCriteria> {
    const existing = await this.prisma.eligibilityCriteria.findFirst({
      where: { scholarshipId },
    });

    if (!existing) {
      throw new Error(
        `Eligibility criteria not found for scholarship ${scholarshipId}`,
      );
    }

    const updated = await this.prisma.eligibilityCriteria.update({
      where: { id: existing.id },
      data: EligibilityCriteriaMapper.toUpdatePrisma(data),
    });

    return EligibilityCriteriaMapper.toDomain(updated);
  }

  async delete(scholarshipId: string): Promise<void> {
    await this.prisma.eligibilityCriteria.deleteMany({
      where: { scholarshipId },
    });
  }
}
