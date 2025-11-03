import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { UnsaveScholarshipCommand } from './unsave-scholarship.command';
import {
  ISavedScholarshipRepository,
  SAVED_SCHOLARSHIP_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@CommandHandler(UnsaveScholarshipCommand)
export class UnsaveScholarshipCommandHandler extends BaseCommandHandler<
  UnsaveScholarshipCommand,
  void
> {
  constructor(
    @Inject(SAVED_SCHOLARSHIP_REPOSITORY)
    private readonly savedScholarshipRepository: ISavedScholarshipRepository,
  ) {
    super();
  }

  async execute(command: UnsaveScholarshipCommand): Promise<void> {
    const { userId, scholarshipId } = command;

    // Delete if exists (no error if not found)
    await this.savedScholarshipRepository.unsave(userId, scholarshipId);
  }
}
