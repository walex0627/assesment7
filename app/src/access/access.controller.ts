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

import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@ApiTags('Access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  // CREATE ACCESS (REGISTER CREDENTIALS)
  @Post()
  @ApiOperation({
    summary: 'Create an access record',
    description:
      'Creates an access record that links a user and a role with login credentials (email and password).',
  })
  @ApiBody({
    description: 'Access creation payload',
    type: CreateAccessDto,
    examples: {
      basic: {
        summary: 'Basic access creation example',
        value: {
          email: 'john.doe@example.com',
          password: 'MySecurePassword123',
          user_id: 1,
          role_id: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Access record created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or missing data',
  })
  @ApiResponse({
    status: 409,
    description:
      'Access record already exists or violates a unique constraint (email)',
  })
  async create(@Body() dto: CreateAccessDto) {
    return await this.accessService.createAccess(dto);
  }

  // GET ALL ACCESS RECORDS
  @Get()
  @ApiOperation({
    summary: 'Get all access records',
    description:
      'Returns a list of all access records, including their related user and role.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of access records returned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No access records found',
  })
  async findAll() {
    return await this.accessService.getAllAccess();
  }

  // GET ACCESS BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get an access record by ID',
    description:
      'Retrieves a single access record by providing its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Access ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Access record found successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Access record not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.accessService.getAccessById(id);
  }

  // UPDATE ACCESS
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an access record',
    description:
      'Updates an existing access record using its ID and a payload. You can change email, password, user, or role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Access ID',
    example: 2,
  })
  @ApiBody({
    description: 'Access update payload',
    type: UpdateAccessDto,
    examples: {
      basic: {
        summary: 'Basic update example',
        value: {
          email: 'updated.email@example.com',
          password: 'NewSecurePassword456',
          role_id: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Access record updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Access record not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Access data violates a unique constraint (for example, duplicated email)',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccessDto,
  ) {
    return await this.accessService.updateAccess(id, dto);
  }

  // DELETE ACCESS
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an access record',
    description:
      'Permanently removes an access record from the database. This does not delete the linked user or role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Access ID',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Access record deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Access record not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.accessService.deleteAccess(id);
  }
}
