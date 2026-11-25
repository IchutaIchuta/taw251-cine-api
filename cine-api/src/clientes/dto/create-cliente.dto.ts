import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Mamani' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  paterno: string;

  @ApiPropertyOptional({ example: 'Quispe' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  materno?: string;

  @ApiProperty({ example: 'juan.mamani@gmail.com' })
  @IsEmail()
  email: string;
}
