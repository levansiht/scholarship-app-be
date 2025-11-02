import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchScholarshipsHttpDto {
  @ApiPropertyOptional({
    description: 'Search keyword (searches in title and description)',
    example: 'undergraduate',
  })
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Minimum scholarship amount',
    example: 10000000,
  })
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum scholarship amount',
    example: 100000000,
  })
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Status filter',
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    example: 'PUBLISHED',
  })
  status?: string;
}
