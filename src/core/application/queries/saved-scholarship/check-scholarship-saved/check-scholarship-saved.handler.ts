import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { CheckScholarshipSavedQuery } from './check-scholarship-saved.query';
import {
  ISavedScholarshipRepository,
  SAVED_SCHOLARSHIP_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@QueryHandler(CheckScholarshipSavedQuery)
export class CheckScholarshipSavedQueryHandler extends BaseQueryHandler<
  CheckScholarshipSavedQuery,
  { isSaved: boolean }
> {
  constructor(
    @Inject(SAVED_SCHOLARSHIP_REPOSITORY)
    private readonly savedScholarshipRepository: ISavedScholarshipRepository,
  ) {
    super();
  }

  async query(
    query: CheckScholarshipSavedQuery,
  ): Promise<{ isSaved: boolean }> {
    const { userId, scholarshipId } = query;

    const isSaved = await this.savedScholarshipRepository.isSaved(
      userId,
      scholarshipId,
    );

    return { isSaved };
  }
}
