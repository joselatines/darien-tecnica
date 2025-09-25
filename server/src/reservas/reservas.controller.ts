import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { PrismaService } from '../prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ApiPaginatedResponse } from './api-paginated-response/api-paginated-response.decorator';
import { ReservaDto } from './dto/reserva.dto';
import { createPaginator } from 'prisma-pagination';
import { PaginatedOutputDto } from './dto/paginated-output.dto';
import { ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { Reserva as ReservaEntity } from './entities/reserva.entity';

@ApiSecurity('api-key')
@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly reservasService: ReservasService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto as any);
  }

  @Get()
  @ApiQuery({
    name: 'clientId',
    required: false,
    type: String,
    description: 'Client id',
  })
  @ApiPaginatedResponse(ReservaDto)
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('clientId') clientId?: string,
  ): Promise<PaginatedOutputDto<ReservaEntity>> {
    const paginate = createPaginator({ perPage });

    let where = {};
    if (clientId) {
      where = { clientId: clientId };
    }
    const result: PaginatedOutputDto<ReservaEntity> = await paginate(
      this.prisma.reserva,
      {
        where: where,
        orderBy: {
          id: 'desc',
        },
      },
      {
        page,
      },
    );

    // add emails for ui
    const reservasWithEmails = await Promise.all(
      result.data.map(async (reserva) => {
        const client = await this.prisma.client.findUnique({
          where: { id: reserva.clientId },
        });

        if (!client) {
          throw new Error('Client not found');
        }

        return { ...reserva, clientEmail: client.email };
      }),
    );

    return { ...result, data: reservasWithEmails };
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
