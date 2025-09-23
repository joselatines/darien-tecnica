import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { EspaciosService } from './espacios.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@Controller('espacios')
export class EspaciosController {
  constructor(private readonly espaciosService: EspaciosService) {}

  @Post()
  async create(@Body() createEspacioDto: CreateEspacioDto) {
    // check if name is unique
    const found = await this.espaciosService.findOne({
      name: createEspacioDto.name,
    });

    if (found) throw new BadRequestException('Espacio already exists');
    return this.espaciosService.create(createEspacioDto);
  }

  @Get()
  findAll() {
    return this.espaciosService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.espaciosService.findOne({ id: id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEspacioDto: UpdateEspacioDto,
  ) {
  
    const found = await this.espaciosService.findOne({
      name: updateEspacioDto.name,
    });

    if (found) throw new BadRequestException('Espacio already exists');

    return this.espaciosService.update({
      where: { id: id },
      data: updateEspacioDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const found = await this.espaciosService.findOne({ id: id });

    if (!found) throw new BadRequestException('Espacio not found');

    return this.espaciosService.remove({ id: id });
  }
}
