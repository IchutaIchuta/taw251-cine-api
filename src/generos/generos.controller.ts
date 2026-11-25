import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@ApiTags('Géneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generoService: GenerosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los géneros' })
  @ApiOkResponse({ description: 'Lista de géneros' })
  findAll() {
    return this.generoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un género por id (incluye sus películas)' })
  @ApiOkResponse({ description: 'Género encontrado' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.generoService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Crear un género' })
  @ApiCreatedResponse({ description: 'Género creado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateGeneroDto) {
    return this.generoService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Actualizar un género' })
  @ApiOkResponse({ description: 'Género actualizado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGeneroDto) {
    return this.generoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Eliminar un género (borrado lógico)' })
  @ApiOkResponse({ description: 'Género eliminado' })
  @ApiNotFoundResponse({ description: 'El género no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.generoService.remove(id);
  }
}
