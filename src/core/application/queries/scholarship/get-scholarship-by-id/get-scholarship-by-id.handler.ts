import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { GetScholarshipByIdQuery } from './get-scholarship-by-id.query';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship } from '../../../../domain/entities';
import {
  UuidSchema,
  SCHOLARSHIP_ERRORS,
} from '../../../../../shared/constants';

@Injectable()
export class GetScholarshipByIdQueryHandler extends BaseQueryHandler<
  GetScholarshipByIdQuery,
  Scholarship
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async query(query: GetScholarshipByIdQuery): Promise<Scholarship> {
    this.validateWithSchema(query.scholarshipId, UuidSchema);

    const scholarship = await this.scholarshipRepository.findById(
      query.scholarshipId,
    );

    if (!scholarship) {
      throw new NotFoundException(
        SCHOLARSHIP_ERRORS.NOT_FOUND(query.scholarshipId),
      );
    }

    return scholarship;
  }
}
