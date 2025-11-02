import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveApplicationHttpDto {
  @ApiPropertyOptional({
    description: 'Approval notes/comments',
    example: 'Excellent application with outstanding academic records',
  })
  notes?: string;
}
