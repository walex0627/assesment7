import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString} from 'class-validator';

export class CreateUserDto {
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
    birth_date?: Date;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
