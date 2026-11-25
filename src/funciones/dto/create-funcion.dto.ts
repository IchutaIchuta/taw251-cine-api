import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateFuncionDto {
  @ApiProperty({ example: 1, description: 'Id de la sala' })
  @IsInt()
  idSala: number;

  @ApiProperty({ example: 1, description: 'Id de la película' })
  @IsInt()
  idPelicula: number;

  @ApiProperty({
    example: '2026-12-01T19:30:00',
    description: 'Fecha y hora de la función (ISO 8601)',
  })
  @IsDateString()
  fechaHora: string;

  @ApiProperty({ example: 35.5, description: 'Precio del boleto (Bs.)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio: number;
}
