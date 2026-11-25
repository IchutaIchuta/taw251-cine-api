import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBoletoDto {
  @ApiProperty({ example: 1, description: 'Id de la función' })
  @IsInt()
  idFuncion: number;

  @ApiProperty({ example: 1, description: 'Id del cliente' })
  @IsInt()
  idCliente: number;

  @ApiProperty({
    example: 5,
    description: 'Número de asiento (entre 1 y la capacidad de la sala)',
  })
  @IsInt()
  @Min(1)
  numeroAsiento: number;

  @ApiPropertyOptional({
    example: 35.5,
    description: 'Precio pagado; si no se envía se usa el precio de la función',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPagado?: number;
}
