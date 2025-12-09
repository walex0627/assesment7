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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE USER
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a new user by providing basic information such as fullname, phone, address and optional birth date.',
  })
  @ApiBody({
    description: 'User creation payload',
    type: CreateUserDto,
    examples: {
      basic: {
        summary: 'Basic user creation example',
        value: {
          fullname: 'Walter Alex',
          phone: '3001234567',
          address: 'Barranquilla, Colombia',
          birth_date: '2000-05-10T00:00:00.000Z',
          is_active: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or missing data',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists or violates a unique constraint',
  })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  // GET ALL USERS
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all active users in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users returned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No users found',
  })
  async findAll() {
    return await this.userService.getAllUsers();
  }

  // GET USER BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Retrieves a single user by providing their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  // UPDATE USER
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
    description:
      'Updates an existing user using their ID and a partial payload. Only the provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiBody({
    description: 'User update payload',
    type: UpdateUserDto,
    examples: {
      basic: {
        summary: 'Example update payload',
        value: {
          fullname: 'Walter A. Updated',
          phone: '3009876543',
          address: 'Updated address, Barranquilla',
          birth_date: '2000-06-01T00:00:00.000Z',
          is_active: true,
        },
      },
      partial: {
        summary: 'Partial update example',
        value: {
          address: 'New address only',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or ID',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Unique constraint violation',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, dto);
  }

  // SOFT DELETE USER
  @Delete('soft/:id')
  @ApiOperation({
    summary: 'Soft delete a user',
    description:
      'Marks a user as deleted but keeps the record in the database. This is typically implemented using soft-delete.',
  })
  @ApiParam({
    name: 'id',
    example: 3,
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User soft-deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.softDeleteUser(id);
  }

  // HARD DELETE USER
  @Delete(':id')
  @ApiOperation({
    summary: 'Hard delete a user',
    description:
      'Permanently removes the user from the database. This operation cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    example: 5,
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
