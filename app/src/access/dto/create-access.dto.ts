import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAccessDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  user_id: number;

  @IsNumber()
  role_id: number;
}
