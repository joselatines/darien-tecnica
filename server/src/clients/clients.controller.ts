import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    //
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.clientsService.findOne({ id: id });
    if (!result) throw new NotFoundException();
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update({
      where: { id: id },
      data: updateClientDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const found = await this.clientsService.findOne({ id: id });

    if (!found) throw new NotFoundException('Client not found');

    return this.clientsService.remove({ id: id });
  }
}
