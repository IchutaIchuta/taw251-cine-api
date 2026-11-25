import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from './entities/sala.entity';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  create(dto: CreateSalaDto): Promise<Sala> {
    const sala = this.salaRepository.create(dto);
    return this.salaRepository.save(sala);
  }

  findAll(): Promise<Sala[]> {
    return this.salaRepository.find({ order: { idSala: 'ASC' } });
  }

  // Incluye sus funciones
  async findOne(id: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({
      where: { idSala: id },
      relations: ['funciones'],
    });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${id} no existe`);
    }
    return sala;
  }

  async update(id: number, dto: UpdateSalaDto): Promise<Sala> {
    const sala = await this.findOne(id); // lanza 404 si no existe
    this.salaRepository.merge(sala, dto);
    return this.salaRepository.save(sala);
  }

  // Borrado lógico: llena eliminadoEn, no borra la fila
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.salaRepository.softDelete(id);
    return { mensaje: `La sala con id ${id} fue eliminada` };
  }
}
