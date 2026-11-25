import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { Boleto } from './entities/boleto.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  // Trae la función con su sala (se necesita la capacidad)
  private async buscarFuncion(idFuncion: number): Promise<Funcion> {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion },
      relations: ['sala'],
    });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${idFuncion} no existe`);
    }
    return funcion;
  }

  private async buscarCliente(idCliente: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ idCliente });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${idCliente} no existe`);
    }
    return cliente;
  }

  // Reglas de negocio del asiento:
  // 1) debe estar entre 1 y la capacidad de la sala de la función
  // 2) no puede repetirse en la misma función. Los boletos anulados
  //    (soft delete) no cuentan porque find() ya los excluye.
  //    Al actualizar se excluye el propio boleto (idBoletoExcluir).
  // No se usa un índice UNIQUE en la BD porque chocaría con los
  // boletos anulados, que siguen guardados en la tabla.
  private async validarAsiento(
    funcion: Funcion,
    numeroAsiento: number,
    idBoletoExcluir?: number,
  ): Promise<void> {
    const capacidad = funcion.sala.capacidad;
    if (numeroAsiento < 1 || numeroAsiento > capacidad) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} no existe: la sala de la función ${funcion.idFuncion} tiene asientos del 1 al ${capacidad}`,
      );
    }

    const where: FindOptionsWhere<Boleto> = {
      idFuncion: funcion.idFuncion,
      numeroAsiento,
    };
    if (idBoletoExcluir !== undefined) {
      where.idBoleto = Not(idBoletoExcluir);
    }
    const ocupado = await this.boletoRepository.exists({ where });
    if (ocupado) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} ya está ocupado en la función ${funcion.idFuncion}`,
      );
    }
  }

  async create(dto: CreateBoletoDto): Promise<Boleto> {
    const funcion = await this.buscarFuncion(dto.idFuncion);
    const cliente = await this.buscarCliente(dto.idCliente);
    await this.validarAsiento(funcion, dto.numeroAsiento);

    const boleto = this.boletoRepository.create({
      ...dto,
      // Si no envían precioPagado, se cobra el precio de la función
      precioPagado: dto.precioPagado ?? funcion.precio,
      funcion,
      cliente,
    });
    const guardado = await this.boletoRepository.save(boleto);
    return this.findOne(guardado.idBoleto);
  }

  // Incluye su función y su cliente
  findAll(): Promise<Boleto[]> {
    return this.boletoRepository.find({
      relations: ['funcion', 'cliente'],
      order: { idBoleto: 'ASC' },
    });
  }

  // Incluye su función y su cliente
  async findOne(id: number): Promise<Boleto> {
    const boleto = await this.boletoRepository.findOne({
      where: { idBoleto: id },
      relations: ['funcion', 'cliente'],
    });
    if (!boleto) {
      throw new NotFoundException(`El boleto con id ${id} no existe`);
    }
    return boleto;
  }

  async update(id: number, dto: UpdateBoletoDto): Promise<Boleto> {
    const boleto = await this.findOne(id); // lanza 404 si no existe

    // Si cambian la función o el cliente, validar que existan.
    // Se reemplaza también la relación cargada, si no TypeORM
    // guardaría el id de la relación antigua.
    const funcion = await this.buscarFuncion(dto.idFuncion ?? boleto.idFuncion);
    if (dto.idCliente !== undefined) {
      boleto.cliente = await this.buscarCliente(dto.idCliente);
    }

    // Si cambia la función o el asiento, se vuelve a validar el asiento
    if (dto.idFuncion !== undefined || dto.numeroAsiento !== undefined) {
      await this.validarAsiento(
        funcion,
        dto.numeroAsiento ?? boleto.numeroAsiento,
        id,
      );
    }

    this.boletoRepository.merge(boleto, dto);
    boleto.funcion = funcion;
    await this.boletoRepository.save(boleto);
    return this.findOne(id);
  }

  // Anular = borrado lógico: el asiento vuelve a quedar libre
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.boletoRepository.softDelete(id);
    return { mensaje: `El boleto con id ${id} fue anulado` };
  }
}
