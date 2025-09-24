import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspaciosModule } from './espacios/espacios.module';
import { PrismaService } from './prisma.service';
import { ReservasModule } from './reservas/reservas.module';
import { ClientsModule } from './clients/clients.module';
import { ApiKeyMiddleware } from './api-key/api-key.middleware';

@Module({
  imports: [EspaciosModule, ReservasModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
