import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordHttpDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPass123!',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New password (min 8 characters)',
    example: 'NewPass456!',
  })
  newPassword: string;
}
