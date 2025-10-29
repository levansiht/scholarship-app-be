import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { CreateScholarshipCommand } from './create-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship } from '../../../../domain/entities';
import { CreateScholarshipDtoSchema } from '../../../../domain/dtos/scholarship.dto.schema';
import { SCHOLARSHIP_ERRORS } from '../../../../../shared/constants';

@Injectable()
export class CreateScholarshipCommandHandler extends BaseCommandHandler<
  CreateScholarshipCommand,
  Scholarship
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: CreateScholarshipCommand): Promise<Scholarship> {
    const validatedDto = CreateScholarshipDtoSchema.parse(command.dto);

    const existingScholarship = await this.scholarshipRepository.findBySlug(
      validatedDto.slug,
    );
    if (existingScholarship) {
      throw new ConflictException(
        SCHOLARSHIP_ERRORS.SLUG_EXISTS(validatedDto.slug),
      );
    }

    const scholarship = await this.scholarshipRepository.create({
      ...validatedDto,
      endDate: validatedDto.endDate ?? undefined,
      thumbnailUrl: validatedDto.thumbnailUrl ?? undefined,
    });

    return scholarship;
  }
}
