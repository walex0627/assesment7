import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
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

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // CREATE ROLE
  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Creates a new role by providing a valid payload.',
  })
  @ApiBody({
    description: 'Role creation payload',
    type: CreateRoleDto,
    examples: {
      basic: {
        summary: 'Example payload',
        value: {
          role_name: 'ADMIN',
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or missing data',
  })
  @ApiResponse({
    status: 409,
    description: 'Role already exists or violates a unique constraint',
  })
  async create(@Body() dto: CreateRoleDto) {
    return await this.roleService.createRole(dto);
  }

  // GET ALL ROLES
  @Get()
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Returns a list of all roles in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles returned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No roles found',
  })
  async findAll() {
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.getRoleById(id);
  }

  // UPDATE ROLE BY ID
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role',
    description: 'Updates an existing role using its ID and payload.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: 2,
  })
  @ApiBody({
    description: 'Role update payload',
    type: UpdateRoleDTO,
    examples: {
      basic: {
        summary: 'Example update payload',
        value: {
          role_name: 'MANAGER',
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
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
    description: 'Role data violates a unique constraint',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDTO,
  ) {
    return await this.roleService.updateRoleById(id, dto);
  }

  // DELETE ROLE BY ID
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a role',
    description: 'Permanently removes a role from the database.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.deleteRoleById(id);
  }
}
