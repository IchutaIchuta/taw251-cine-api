import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGeneroDto {
  @ApiProperty({ example: 'Acción' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @ApiPropertyOptional({ example: 'Películas con escenas de alto impacto' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
