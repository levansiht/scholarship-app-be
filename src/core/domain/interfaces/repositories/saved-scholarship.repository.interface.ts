import { SavedScholarship } from '../../entities';

export interface ISavedScholarshipRepository {
  save(
    userId: string,
    scholarshipId: string,
    note?: string,
  ): Promise<SavedScholarship>;

  unsave(userId: string, scholarshipId: string): Promise<void>;

  findByUserId(userId: string): Promise<SavedScholarship[]>;

  isSaved(userId: string, scholarshipId: string): Promise<boolean>;

  findById(id: string): Promise<SavedScholarship | null>;
}

export const SAVED_SCHOLARSHIP_REPOSITORY = 'SAVED_SCHOLARSHIP_REPOSITORY';
