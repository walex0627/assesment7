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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 🔑 Essential for PolicyGuard to read required roles
import { Roles } from 'src/common/decorators/roles.decorator'; 


@ApiTags('Users')
@Controller('users')
// The PolicyGuard is applied globally, so we don't need @UseGuards here.
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔑 CREATE USER: Protected by PolicyGuard -> Checks if role == 'Administrator'
  @Post()
  //@Roles('Administrator') 
  @ApiOperation({
    summary: 'Create a new user (Admin Only)',
    description: 'Creates a new user with basic information. Requires Administrator role.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator)',
  })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  // 🔑 GET ALL USERS: Protected by PolicyGuard -> Checks if role == 'Administrator'
  @Get()
  @Roles('Administrator') 
  @ApiOperation({
    summary: 'Get all users (Admin Only)',
    description: 'Returns a list of all users in the system. Requires Administrator role.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users returned successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator)',
  })
  async findAll() {
    return await this.userService.getAllUsers();
  }

  // 🔑 GET USER BY ID: Protected by PolicyGuard -> Checks if role == 'Administrator'
  @Get(':id')
  @Roles('Administrator') 
  @ApiOperation({
    summary: 'Get a user by ID (Admin Only)',
    description: 'Retrieves a single user by providing their ID. Requires Administrator role.',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator)',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  // 🔑 UPDATE USER: Protected by PolicyGuard -> Checks if role == 'Administrator'
  @Patch(':id')
  @Roles('Administrator') 
  @ApiOperation({
    summary: 'Update a user (Admin Only)',
    description: 'Updates an existing user using their ID and a partial payload. Requires Administrator role.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator)',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, dto);
  }

  // 🔑 DELETE USER (HARD DELETE): Protected by PolicyGuard -> Checks if role == 'Administrator'
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @Roles('Administrator') 
  @ApiOperation({
    summary: 'Permanently delete a user (Admin Only)',
    description: 'Permanently removes the user from the database. Requires Administrator role.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator)',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}