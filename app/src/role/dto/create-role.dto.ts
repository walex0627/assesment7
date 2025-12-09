import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {

    @ApiProperty({
        example: 'Admin',
        description: 'Name of the role',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string;

}
