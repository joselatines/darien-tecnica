import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email of the client',
  })
  @IsEmail()
  email: string;
}
