import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSalaDto {
  @ApiProperty({ example: 'Sala 1', description: 'Nombre de la sala' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 80, description: 'Cantidad de asientos' })
  @IsInt()
  @Min(1)
  capacidad: number;

  @ApiProperty({ example: '2D', enum: ['2D', '3D', 'IMAX'] })
  @IsIn(['2D', '3D', 'IMAX'])
  tipo: string;
}
