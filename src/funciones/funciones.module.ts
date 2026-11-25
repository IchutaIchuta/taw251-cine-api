import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcion } from './entities/funcion.entity';
import { FuncionesService } from './funciones.service';
import { FuncionesController } from './funciones.controller';
import { SalasModule } from '../salas/salas.module';
import { PeliculasModule } from '../peliculas/peliculas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion]), SalasModule, PeliculasModule],
  controllers: [FuncionesController],
  providers: [FuncionesService],
  exports: [FuncionesService, TypeOrmModule], // otros módulos podrán usar su repositorio
})
export class FuncionesModule {}
