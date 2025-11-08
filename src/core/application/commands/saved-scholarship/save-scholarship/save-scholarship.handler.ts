import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { SaveScholarshipCommand } from './save-scholarship.command';
import { SavedScholarship } from '../../../../domain/entities';
import {
  ISavedScholarshipRepository,
  SAVED_SCHOLARSHIP_REPOSITORY,
  IRepositoryScholarship,
  SCHOLARSHIP_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@CommandHandler(SaveScholarshipCommand)
export class SaveScholarshipCommandHandler extends BaseCommandHandler<
  SaveScholarshipCommand,
  SavedScholarship
> {
  constructor(
    @Inject(SAVED_SCHOLARSHIP_REPOSITORY)
    private readonly savedScholarshipRepository: ISavedScholarshipRepository,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: SaveScholarshipCommand): Promise<SavedScholarship> {
    const { userId, scholarshipId, note } = command;

    // 1. Validate scholarship exists
    const scholarship =
      await this.scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new NotFoundException(
        `Scholarship with ID ${scholarshipId} not found`,
      );
    }

    // 2. Check if already saved
    const alreadySaved = await this.savedScholarshipRepository.isSaved(
      userId,
      scholarshipId,
    );
    if (alreadySaved) {
      throw new ConflictException('Scholarship already saved');
    }

    // 3. Save scholarship
    try {
      return await this.savedScholarshipRepository.save(
        userId,
        scholarshipId,
        note,
      );
    } catch {
      throw new BadRequestException('Failed to save scholarship');
    }
  }
}
