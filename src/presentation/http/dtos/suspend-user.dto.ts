import { ApiPropertyOptional } from '@nestjs/swagger';
export class SuspendUserHttpDto {
  @ApiPropertyOptional({
    description: 'Reason for suspension',
    example: 'Violated community guidelines',
  })
  reason?: string;
}
