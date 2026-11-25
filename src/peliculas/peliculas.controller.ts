import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { AgregarGenerosDto } from './dto/agregar-generos.dto';

@ApiTags('Películas')
@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculaService: PeliculasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las películas (incluye sus géneros)' })
  @ApiOkResponse({ description: 'Lista de películas' })
  findAll() {
    return this.peliculaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una película por id (incluye sus géneros y funciones)',
  })
  @ApiOkResponse({ description: 'Película encontrada' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'La película no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peliculaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una película (con géneros opcionales)' })
  @ApiCreatedResponse({ description: 'Película creada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Algún género no existe' })
  create(@Body() dto: CreatePeliculaDto) {
    return this.peliculaService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una película' })
  @ApiOkResponse({ description: 'Película actualizada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'La película o algún género no existe' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePeliculaDto,
  ) {
    return this.peliculaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una película (borrado lógico)' })
  @ApiOkResponse({ description: 'Película eliminada' })
  @ApiNotFoundResponse({ description: 'La película no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peliculaService.remove(id);
  }

  @Post(':id/generos')
  @ApiOperation({ summary: 'Agregar géneros a una película (sin duplicar)' })
  @ApiCreatedResponse({ description: 'Géneros agregados' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'La película o algún género no existe' })
  agregarGeneros(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarGenerosDto,
  ) {
    return this.peliculaService.agregarGeneros(id, dto);
  }

  @Delete(':id/generos/:idGenero')
  @ApiOperation({ summary: 'Quitar un género de una película' })
  @ApiOkResponse({ description: 'Género quitado' })
  @ApiBadRequestResponse({ description: 'Algún id no es un número' })
  @ApiNotFoundResponse({
    description: 'La película no existe o no tiene ese género',
  })
  quitarGenero(
    @Param('id', ParseIntPipe) id: number,
    @Param('idGenero', ParseIntPipe) idGenero: number,
  ) {
    return this.peliculaService.quitarGenero(id, idGenero);
  }
}
