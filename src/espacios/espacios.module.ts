import { Module } from '@nestjs/common';
import { EspaciosService } from './espacios.service';
import { EspaciosController } from './espacios.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [EspaciosController],
  providers: [EspaciosService, PrismaService],
})
export class EspaciosModule {}
