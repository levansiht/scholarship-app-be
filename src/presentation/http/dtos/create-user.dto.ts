import { ApiProperty } from '@nestjs/swagger';

export class CreateUserHttpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    example: 'SecurePass123!',
  })
  password: string;
}
