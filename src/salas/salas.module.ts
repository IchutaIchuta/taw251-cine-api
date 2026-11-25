import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sala } from './entities/sala.entity';
import { SalasService } from './salas.service';
import { SalasController } from './salas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sala])],
  controllers: [SalasController],
  providers: [SalasService],
  exports: [SalasService, TypeOrmModule], // otros módulos podrán usar su repositorio
})
export class SalasModule {}
