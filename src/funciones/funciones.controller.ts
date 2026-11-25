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
import { FuncionesService } from './funciones.service';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';

@ApiTags('Funciones')
@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionService: FuncionesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las funciones (incluye sala y película)',
  })
  @ApiOkResponse({ description: 'Lista de funciones' })
  findAll() {
    return this.funcionService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una función por id (incluye sala, película y boletos)',
  })
  @ApiOkResponse({ description: 'Función encontrada' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'La función no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una función' })
  @ApiCreatedResponse({ description: 'Función creada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'La sala o la película no existe' })
  create(@Body() dto: CreateFuncionDto) {
    return this.funcionService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una función' })
  @ApiOkResponse({ description: 'Función actualizada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({
    description: 'La función, la sala o la película no existe',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFuncionDto) {
    return this.funcionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una función (borrado lógico)' })
  @ApiOkResponse({ description: 'Función eliminada' })
  @ApiNotFoundResponse({ description: 'La función no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionService.remove(id);
  }
}
