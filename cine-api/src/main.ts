import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa class-validator en todos los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // error 400 si mandan campos extra
      transform: true, // convierte el body a la clase DTO
    }),
  );

  // Documentación: Swagger genera el JSON y Scalar lo muestra
  const config = new DocumentBuilder()
    .setTitle('API Sistema de Cine')
    .setDescription('Práctica TAW-251 - NestJS + TypeORM + PostgreSQL')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ content: document }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `API: http://localhost:${port}  |  Docs: http://localhost:${port}/docs`,
  );
}
void bootstrap();
