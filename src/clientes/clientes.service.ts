import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  create(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepository.create(dto);
    return this.clienteRepository.save(cliente);
  }

  findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({ order: { idCliente: 'ASC' } });
  }

  // Incluye sus boletos con la función de cada uno
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
      relations: ['boletos', 'boletos.funcion'],
    });
    if (!cliente) {
      throw new NotFoundException(`El cliente con id ${id} no existe`);
    }
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id); // lanza 404 si no existe
    this.clienteRepository.merge(cliente, dto);
    return this.clienteRepository.save(cliente);
  }

  // Borrado lógico: llena eliminadoEn, no borra la fila
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.clienteRepository.softDelete(id);
    return { mensaje: `El cliente con id ${id} fue eliminado` };
  }
}
