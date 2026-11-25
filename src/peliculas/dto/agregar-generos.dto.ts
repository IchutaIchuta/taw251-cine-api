import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AgregarGenerosDto {
  @ApiProperty({
    example: [1, 2],
    type: [Number],
    description: 'Ids de los géneros a agregar',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros: number[];
}
