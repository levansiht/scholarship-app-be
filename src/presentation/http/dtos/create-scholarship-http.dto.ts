import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScholarshipHttpDto {
  @ApiPropertyOptional({
    description:
      'User ID who creates the scholarship (UUID). For testing only - will be removed when auth is implemented. Get this from GET /users endpoint (use admin user).',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Scholarship title',
    example: 'Full Tuition Scholarship 2024',
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the scholarship',
    example:
      'Full tuition coverage for undergraduate students with excellent academic records',
  })
  description: string;

  @ApiProperty({
    description: 'Scholarship amount in VND',
    example: 50000000,
  })
  amount: number;

  @ApiProperty({
    description: 'Number of slots available',
    example: 10,
  })
  numberOfSlots: number;

  @ApiProperty({
    description:
      'Application deadline (ISO 8601 date string) - MUST be in the future',
    example: '2025-12-31T23:59:59Z',
  })
  deadline: string;

  @ApiProperty({
    description: 'Start date (ISO 8601 date string) - MUST be in the future',
    example: '2025-11-01T00:00:00Z',
  })
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date (ISO 8601 date string)',
    example: '2025-12-31T23:59:59Z',
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    example: ['undergraduate', 'merit-based'],
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Thumbnail URL',
    example: 'https://example.com/image.jpg',
  })
  thumbnailUrl?: string;
}
