import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from './entities/genero.entity';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  create(dto: CreateGeneroDto): Promise<Genero> {
    const genero = this.generoRepository.create(dto);
    return this.generoRepository.save(genero);
  }

  findAll(): Promise<Genero[]> {
    return this.generoRepository.find({ order: { idGenero: 'ASC' } });
  }

  // Incluye sus películas
  async findOne(id: number): Promise<Genero> {
    const genero = await this.generoRepository.findOne({
      where: { idGenero: id },
      relations: ['peliculas'],
    });
    if (!genero) {
      throw new NotFoundException(`El género con id ${id} no existe`);
    }
    return genero;
  }

  async update(id: number, dto: UpdateGeneroDto): Promise<Genero> {
    const genero = await this.findOne(id); // lanza 404 si no existe
    this.generoRepository.merge(genero, dto);
    return this.generoRepository.save(genero);
  }

  // Borrado lógico: llena eliminadoEn, no borra la fila
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.generoRepository.softDelete(id);
    return { mensaje: `El género con id ${id} fue eliminado` };
  }
}
