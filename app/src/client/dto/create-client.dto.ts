import { IsString, IsNotEmpty, IsEmail, IsInt } from 'class-validator';

export class CreateClientDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  company: string; 

  @IsEmail()
  @IsNotEmpty()
  contact_email: string; 

  @IsInt()
  @IsNotEmpty()
  user_id: number; 
}