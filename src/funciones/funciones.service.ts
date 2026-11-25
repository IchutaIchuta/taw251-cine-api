import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcion } from './entities/funcion.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
  ) {}

  private async buscarSala(idSala: number): Promise<Sala> {
    const sala = await this.salaRepository.findOneBy({ idSala });
    if (!sala) {
      throw new NotFoundException(`La sala con id ${idSala} no existe`);
    }
    return sala;
  }

  private async buscarPelicula(idPelicula: number): Promise<Pelicula> {
    const pelicula = await this.peliculaRepository.findOneBy({ idPelicula });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${idPelicula} no existe`);
    }
    return pelicula;
  }

  async create(dto: CreateFuncionDto): Promise<Funcion> {
    const sala = await this.buscarSala(dto.idSala);
    const pelicula = await this.buscarPelicula(dto.idPelicula);
    const funcion = this.funcionRepository.create({
      ...dto,
      fechaHora: new Date(dto.fechaHora),
      sala,
      pelicula,
    });
    return this.funcionRepository.save(funcion);
  }

  // Incluye su sala y su película
  findAll(): Promise<Funcion[]> {
    return this.funcionRepository.find({
      relations: ['sala', 'pelicula'],
      order: { idFuncion: 'ASC' },
    });
  }

  // Incluye su sala, su película y sus boletos
  async findOne(id: number): Promise<Funcion> {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion: id },
      relations: ['sala', 'pelicula', 'boletos'],
    });
    if (!funcion) {
      throw new NotFoundException(`La función con id ${id} no existe`);
    }
    return funcion;
  }

  async update(id: number, dto: UpdateFuncionDto): Promise<Funcion> {
    const funcion = await this.findOne(id); // lanza 404 si no existe
    const { fechaHora, ...datos } = dto;
    this.funcionRepository.merge(funcion, datos);
    if (fechaHora) {
      funcion.fechaHora = new Date(fechaHora);
    }
    // Si cambian la sala o la película, validar que existan.
    // Se reemplaza también la relación cargada, si no TypeORM
    // guardaría el id de la relación antigua.
    if (dto.idSala !== undefined) {
      funcion.sala = await this.buscarSala(dto.idSala);
    }
    if (dto.idPelicula !== undefined) {
      funcion.pelicula = await this.buscarPelicula(dto.idPelicula);
    }
    await this.funcionRepository.save(funcion);
    return this.findOne(id);
  }

  // Borrado lógico: llena eliminadoEn, no borra la fila
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.funcionRepository.softDelete(id);
    return { mensaje: `La función con id ${id} fue eliminada` };
  }
}
