// dto structure for update gender
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsIn } from 'class-validator';


// We use PartialType(ApiPropertyOptional) to create a type where
// All properties and validations in ApiPropertyOptional are optional.
export class UpdateRoleDTO extends PartialType(CreateRoleDto) {}
