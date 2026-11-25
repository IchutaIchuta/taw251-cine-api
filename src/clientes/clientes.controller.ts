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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clienteService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiOkResponse({ description: 'Lista de clientes' })
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Obtener un cliente por id (incluye sus boletos con la función de cada uno)',
  })
  @ApiOkResponse({ description: 'Cliente encontrado' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiCreatedResponse({ description: 'Cliente creado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateClienteDto) {
    return this.clienteService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiOkResponse({ description: 'Cliente actualizado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.clienteService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Eliminar un cliente (borrado lógico)' })
  @ApiOkResponse({ description: 'Cliente eliminado' })
  @ApiNotFoundResponse({ description: 'El cliente no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.remove(id);
  }
}
