import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../shared/constants';
export class UpdateUserHttpDto {
  @ApiPropertyOptional({
    description: 'User role (admin only)',
    enum: UserRole,
    example: UserRole.SPONSOR,
  })
  role?: UserRole;
}
