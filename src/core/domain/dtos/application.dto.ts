export interface CreateApplicationDto {
  scholarshipId: string;
  applicantId: string;
  coverLetter?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface UpdateApplicationDto {
  coverLetter?: string;
  documents?: string[];
  additionalInfo?: Record<string, unknown>;
  status?:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'AWARDED'
    | 'WITHDRAWN'
    | 'CANCELLED';
}
