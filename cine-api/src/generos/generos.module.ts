import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genero } from './entities/genero.entity';
import { GenerosService } from './generos.service';
import { GenerosController } from './generos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Genero])],
  controllers: [GenerosController],
  providers: [GenerosService],
  exports: [GenerosService, TypeOrmModule], // otros módulos podrán usar su repositorio
})
export class GenerosModule {}
