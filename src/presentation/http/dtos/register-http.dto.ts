import { ApiProperty } from '@nestjs/swagger';

export class RegisterHttpDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'User email address',
    minLength: 5,
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'User password (min 8 chars, must contain uppercase, lowercase, and number)',
    minLength: 8,
    maxLength: 100,
  })
  password: string;
}
