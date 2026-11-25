import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePeliculaDto {
  @ApiProperty({ example: 'Interestelar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiPropertyOptional({
    example: 'Un grupo de astronautas viaja a través de un agujero de gusano',
  })
  @IsOptional()
  @IsString()
  sinopsis?: string;

  @ApiProperty({ example: 169, description: 'Duración en minutos' })
  @IsInt()
  @Min(1)
  duracionMin: number;

  @ApiProperty({ example: '+13', enum: ['ATP', '+13', '+18'] })
  @IsIn(['ATP', '+13', '+18'])
  clasificacion: string;

  @ApiPropertyOptional({
    example: [1, 2],
    type: [Number],
    description: 'Ids de los géneros de la película',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros?: number[];
}
