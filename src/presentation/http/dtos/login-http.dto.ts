import { ApiProperty } from '@nestjs/swagger';

export class LoginHttpDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  password: string;
}
