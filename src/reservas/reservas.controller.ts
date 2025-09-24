import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  async create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto as any);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.reservasService.findOne({ id: id });
    if (!result) throw new NotFoundException();
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    if (updateReservaDto.reservationDate)
      updateReservaDto.reservationDate = new Date(
        updateReservaDto.reservationDate,
      );

    return this.reservasService.update({
      where: { id: id },
      data: updateReservaDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const found = await this.reservasService.findOne({ id: id });

    if (!found) throw new NotFoundException('Reserva not found');

    return this.reservasService.remove({ id: id });
  }
}
