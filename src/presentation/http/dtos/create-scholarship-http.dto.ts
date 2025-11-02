import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScholarshipHttpDto {
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
