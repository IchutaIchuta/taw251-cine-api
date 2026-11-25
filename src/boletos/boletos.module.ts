import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boleto } from './entities/boleto.entity';
import { BoletosService } from './boletos.service';
import { BoletosController } from './boletos.controller';
import { FuncionesModule } from '../funciones/funciones.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boleto]),
    FuncionesModule,
    ClientesModule,
  ],
  controllers: [BoletosController],
  providers: [BoletosService],
  exports: [BoletosService, TypeOrmModule], // otros módulos podrán usar su repositorio
})
export class BoletosModule {}
