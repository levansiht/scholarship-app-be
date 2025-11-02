import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScholarshipHttpDto {
  @ApiPropertyOptional({
    description: 'Scholarship title',
    example: 'Full Tuition Scholarship 2024',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the scholarship',
    example: 'Updated description',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Application deadline (ISO 8601 date string)',
    example: '2024-12-31T23:59:59Z',
  })
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Number of slots available',
    example: 15,
  })
  numberOfSlots?: number;

  @ApiPropertyOptional({
    description: 'Scholarship status',
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    example: 'PUBLISHED',
  })
  status?: string;
}
