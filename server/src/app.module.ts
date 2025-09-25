import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspaciosModule } from './espacios/espacios.module';
import { PrismaService } from './prisma.service';
import { ReservasModule } from './reservas/reservas.module';
import { ClientsModule } from './clients/clients.module';
import { ApiKeyMiddleware } from './api-key/api-key.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EspaciosModule, ReservasModule, ClientsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: 'auth/*', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
