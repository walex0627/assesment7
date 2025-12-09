import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class RegisterAuthDto {
  // USER FIELDS
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // ACCESS FIELDS (LOGIN)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // ROLE
  @IsOptional()
  @IsNumber()
  role_id?: number; // si no viene, usamos un rol por defecto
}
