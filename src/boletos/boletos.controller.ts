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
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';

@ApiTags('Boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletoService: BoletosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los boletos (incluye función y cliente)',
  })
  @ApiOkResponse({ description: 'Lista de boletos' })
  findAll() {
    return this.boletoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un boleto por id (incluye función y cliente)',
  })
  @ApiOkResponse({ description: 'Boleto encontrado' })
  @ApiBadRequestResponse({ description: 'El id no es un número' })
  @ApiNotFoundResponse({ description: 'El boleto no existe' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletoService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({
    summary:
      'Vender un boleto (si no se envía precioPagado se usa el precio de la función)',
  })
  @ApiCreatedResponse({ description: 'Boleto creado' })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos, asiento fuera de la capacidad de la sala o asiento ocupado',
  })
  @ApiNotFoundResponse({ description: 'La función o el cliente no existe' })
  create(@Body() dto: CreateBoletoDto) {
    return this.boletoService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Actualizar un boleto' })
  @ApiOkResponse({ description: 'Boleto actualizado' })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos, asiento fuera de la capacidad de la sala o asiento ocupado',
  })
  @ApiNotFoundResponse({
    description: 'El boleto, la función o el cliente no existe',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoletoDto) {
    return this.boletoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token no enviado o inválido' })
  @ApiOperation({ summary: 'Anular un boleto (borrado lógico)' })
  @ApiOkResponse({ description: 'Boleto anulado' })
  @ApiNotFoundResponse({ description: 'El boleto no existe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boletoService.remove(id);
  }
}
