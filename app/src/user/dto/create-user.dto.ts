import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsNotEmpty()
    address: string;

}
