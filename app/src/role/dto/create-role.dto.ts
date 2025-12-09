import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {

    @ApiProperty({
        example: 'Vet',
        description: 'Name of the role',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    role_name: string;

    @ApiProperty({
        example: true,
        description: 'Whether the role is active',
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}
