import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { Genero } from '../generos/entities/genero.entity';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { AgregarGenerosDto } from './dto/agregar-generos.dto';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  // Busca los géneros por id; si alguno no existe lanza 404 con su id
  private async buscarGeneros(idGeneros: number[]): Promise<Genero[]> {
    if (idGeneros.length === 0) return [];
    const generos = await this.generoRepository.findBy({
      idGenero: In(idGeneros),
    });
    for (const idGenero of idGeneros) {
      if (!generos.some((g) => g.idGenero === idGenero)) {
        throw new NotFoundException(`El género con id ${idGenero} no existe`);
      }
    }
    return generos;
  }

  async create(dto: CreatePeliculaDto): Promise<Pelicula> {
    const { idGeneros, ...datos } = dto;
    const pelicula = this.peliculaRepository.create(datos);
    pelicula.generos = await this.buscarGeneros(idGeneros ?? []);
    return this.peliculaRepository.save(pelicula);
  }

  // Incluye sus géneros
  findAll(): Promise<Pelicula[]> {
    return this.peliculaRepository.find({
      relations: ['generos'],
      order: { idPelicula: 'ASC' },
    });
  }

  // Incluye sus géneros y funciones
  async findOne(id: number): Promise<Pelicula> {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: ['generos', 'funciones'],
    });
    if (!pelicula) {
      throw new NotFoundException(`La película con id ${id} no existe`);
    }
    return pelicula;
  }

  async update(id: number, dto: UpdatePeliculaDto): Promise<Pelicula> {
    const pelicula = await this.findOne(id); // lanza 404 si no existe
    const { idGeneros, ...datos } = dto;
    this.peliculaRepository.merge(pelicula, datos);
    // Si mandan idGeneros, reemplaza la lista de géneros
    if (idGeneros) {
      pelicula.generos = await this.buscarGeneros(idGeneros);
    }
    return this.peliculaRepository.save(pelicula);
  }

  // Borrado lógico: llena eliminadoEn, no borra la fila
  async remove(id: number): Promise<{ mensaje: string }> {
    await this.findOne(id);
    await this.peliculaRepository.softDelete(id);
    return { mensaje: `La película con id ${id} fue eliminada` };
  }

  // Agrega géneros sin duplicar los que ya tiene
  async agregarGeneros(id: number, dto: AgregarGenerosDto): Promise<Pelicula> {
    const pelicula = await this.findOne(id);
    const generos = await this.buscarGeneros(dto.idGeneros);
    const nuevos = generos.filter(
      (g) => !pelicula.generos.some((pg) => pg.idGenero === g.idGenero),
    );
    pelicula.generos = [...pelicula.generos, ...nuevos];
    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  async quitarGenero(id: number, idGenero: number): Promise<Pelicula> {
    const pelicula = await this.findOne(id);
    if (!pelicula.generos.some((g) => g.idGenero === idGenero)) {
      throw new NotFoundException(
        `La película con id ${id} no tiene el género con id ${idGenero}`,
      );
    }
    pelicula.generos = pelicula.generos.filter((g) => g.idGenero !== idGenero);
    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }
}
