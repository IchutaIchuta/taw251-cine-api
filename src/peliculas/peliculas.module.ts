import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { GenerosModule } from '../generos/generos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula]), GenerosModule],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService, TypeOrmModule], // otros módulos podrán usar su repositorio
})
export class PeliculasModule {}
