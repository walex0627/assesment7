import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(100) // Límite de ejemplo para el título
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}