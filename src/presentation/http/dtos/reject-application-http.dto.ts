import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RejectApplicationHttpDto {
  @ApiProperty({
    description: 'Reason for rejection',
    example: 'Does not meet minimum GPA requirement',
  })
  reason: string;

  @ApiPropertyOptional({
    description: 'Additional notes/comments',
    example: 'Applicant can reapply next semester',
  })
  notes?: string;
}
