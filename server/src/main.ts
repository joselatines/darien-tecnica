import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable DTO validation pies
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Dorian Prueba Tecnica')
    .setDescription('Prueba Tecnica Dorian')
    .setVersion('1.0')
    .addTag('Espacios')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
