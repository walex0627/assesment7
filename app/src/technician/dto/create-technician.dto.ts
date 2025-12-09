// src/technician/dto/create-technician.dto.ts

import { IsString, IsNotEmpty, IsInt, IsIn, IsBoolean } from 'class-validator';

export class CreateTechnicianDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  speciality: string;

  @IsString()
  @IsNotEmpty()
  availability: string; 

  @IsInt()
  @IsNotEmpty()
  userId: number; 
}