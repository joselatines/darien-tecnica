import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspaciosModule } from './espacios/espacios.module';
import { PrismaService } from './prisma.service';
import { ReservasModule } from './reservas/reservas.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [EspaciosModule, ReservasModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
