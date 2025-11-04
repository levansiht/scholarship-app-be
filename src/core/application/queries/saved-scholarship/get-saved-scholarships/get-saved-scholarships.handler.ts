import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetSavedScholarshipsQuery } from './get-saved-scholarships.query';
import { SavedScholarship } from '../../../../domain/entities';
import {
  ISavedScholarshipRepository,
  SAVED_SCHOLARSHIP_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@QueryHandler(GetSavedScholarshipsQuery)
export class GetSavedScholarshipsQueryHandler extends BaseQueryHandler<
  GetSavedScholarshipsQuery,
  SavedScholarship[]
> {
  constructor(
    @Inject(SAVED_SCHOLARSHIP_REPOSITORY)
    private readonly savedScholarshipRepository: ISavedScholarshipRepository,
  ) {
    super();
  }

  async query(query: GetSavedScholarshipsQuery): Promise<SavedScholarship[]> {
    const { userId } = query;

    return await this.savedScholarshipRepository.findByUserId(userId);
  }
}
