import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspaciosModule } from './espacios/espacios.module';
import { PrismaService } from './prisma.service';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [EspaciosModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
