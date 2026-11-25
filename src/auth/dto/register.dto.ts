import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jmamani' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'juan.mamani@gmail.com' })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'secreto123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
