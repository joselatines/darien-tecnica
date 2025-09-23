import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspaciosModule } from './espacios/espacios.module';

@Module({
  imports: [EspaciosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
