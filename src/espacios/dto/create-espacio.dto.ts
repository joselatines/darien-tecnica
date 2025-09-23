import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateEspacioDto {
  @ApiProperty({
    example: 'Coworking plaza 1',
    description: 'The name of the "espacio"',
  })
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Caracas',
    description: 'The location of the "espacio"',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 5,
    description: 'The capacity of the "espacio"',
  })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    example: 'This coworking space is made for JS developers',
    description: 'The description of the "espacio"',
  })
  @IsString()
  description?: string;
}
