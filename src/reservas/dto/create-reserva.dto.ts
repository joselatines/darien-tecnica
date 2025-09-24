import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, Matches } from 'class-validator';
type Status = 'confirmed' | 'pending' | 'cancelled';

export class CreateReservaDto {
  @ApiProperty({
    example: '6165161',
    description: 'The id of the espacio',
  })
  @IsString()
  espacioId: string;

  @ApiProperty({
    example: '6165161',
    description: 'The id of the client',
  })
  @IsString()
  clienteId: string;

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
  startTime: string;

  @ApiProperty({
    example: '02:30',
    description: 'The end time of the reservation',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'The end time must be in HH:mm (24 hours format)',
  })
  endTime: string;

  @ApiProperty({
    example: 'confirmed',
    description: 'The status of the reservation',
    enum: ['confirmed', 'pending', 'cancelled'],
  })
  @IsString()
  status: Status;
}
