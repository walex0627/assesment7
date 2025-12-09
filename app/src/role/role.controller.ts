import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { Role } from './entities/role.entity'; 

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // CREATE ROLE
  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Creates a new role by providing its unique name.',
  })
  @ApiBody({
    description: 'Role creation payload',
    type: CreateRoleDto,
    examples: {
      basic: {
        summary: 'Basic role creation example',
        // 🔑 AJUSTE: El DTO solo debería recibir 'name' (según la entidad Role)
        value: {
          name: 'Manager',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role, 
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or missing data',
  })
  @ApiResponse({
    status: 409,
    description: 'Role already exists (Violation of unique name constraint)', // Más específico
  })
  async create(@Body() dto: CreateRoleDto): Promise<Role> {
    return await this.roleService.createRole(dto);
  }

  // GET ALL ROLES
  @Get()
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Returns a list of all defined roles in the system, including their associated accesses (permissions).',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all roles returned successfully',
    type: [Role],
  })
  async findAll(): Promise<Role[]> {
    return await this.roleService.getAllRoles();
  }

  // GET ROLE BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by ID',
    description: 'Retrieves a single role by providing its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role found successfully',
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return await this.roleService.getRoleById(id);
  }

  // UPDATE ROLE
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role',
    description:
      'Updates an existing role using its ID. Only the name field can be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: 1,
  })
  @ApiBody({
    description: 'Role update payload',
    type: UpdateRoleDTO,
    examples: {
      partial: {
        summary: 'Example updating the role name',
        // 🔑 AJUSTE: Solo se puede actualizar el 'name'
        value: {
          name: 'Super Admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Unique constraint violation (if the new name already exists)',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDTO,
  ): Promise<Role> {
    return await this.roleService.updateRole(id, dto);
  }

  // DELETE ROLE (HARD DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({
    summary: 'Permanently delete a role',
    description: 'Permanently removes the role from the database. This operation cannot be undone. Note: Deleting a role might affect related entities (e.g., accesses or users) depending on the foreign key constraints.',
  })
  @ApiParam({
    name: 'id',
    example: 3,
    description: 'Role ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Role deleted successfully (No Content)',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.roleService.deleteRole(id);
  }
}