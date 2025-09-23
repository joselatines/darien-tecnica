import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsString, Matches } from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({
    example: '6165161',
    description: 'The id of the espacio',
  })
  @IsString()
  espacioId: string;

  @ApiProperty({
    example: 'jose@test.com',
    description: 'The email of the client',
  })
  @IsEmail()
  clientEmail: string;

  @ApiProperty({
    example: '2002-11-13',
    description: 'The date of the reservation ISO 8601 format YYYY-MM-DD',
  })
  @IsISO8601()
  reservationDate: Date;

  @ApiProperty({
    example: '01:30',
    description: 'The start time of the reservation',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'The start time must be in HH:mm (24 hours format)',
  })
  startTime: Date;

  @ApiProperty({
    example: '02:30',
    description: 'The end time of the reservation',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'The end time must be in HH:mm (24 hours format)',
  })
  endTime: Date;
}
