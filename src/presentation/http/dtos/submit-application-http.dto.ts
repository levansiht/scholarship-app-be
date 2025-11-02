import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitApplicationHttpDto {
  @ApiProperty({
    description: 'Scholarship ID to apply for',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  scholarshipId: string;

  @ApiPropertyOptional({
    description: 'JSON object containing application documents/data',
    example: { cv: 'url', motivation: 'text', grades: 'url' },
  })
  documents?: Record<string, any>;
}
