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
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@ApiTags('Salas')
@Controller('salas')
export class SalasController {
  constructor(private readonly salaService: SalasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las salas' })
  @ApiOkResponse({ description: 'Lista de salas' })
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sala por id (incluye sus funciones)' })
  @ApiOkResponse({ description: 'Sala encontrada' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una sala' })
  @ApiCreatedResponse({ description: 'Sala creada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateSalaDto) {
    return this.salaService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiOkResponse({ description: 'Sala actualizada' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalaDto) {
    return this.salaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sala (borrado lógico)' })
  @ApiOkResponse({ description: 'Sala eliminada' })
  @ApiNotFoundResponse({ description: 'La sala no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.remove(id);
  }
}
