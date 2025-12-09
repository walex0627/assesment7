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

import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
// 🔑 Import the Roles decorator
import { Roles } from 'src/common/decorators/roles.decorator'; 


@ApiTags('Clients')
@Controller('clients')
// NOTE: Assuming PolicyGuard/JwtAuthGuard is configured GLOBALLY.
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // 🔑 CREATE CLIENT - Requires Administrator Role
  @Post()
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Register a new client (Admin Only)',
      description: 'Creates a new client entity and links it to an existing user via the provided user_id. Requires Administrator role.',
  })
  @ApiBody({
      type: CreateClientDto,
      examples: {
          basic: {
              summary: 'Basic client creation example',
              value: {
                  name: 'John Doe',
                  company: 'Acme Corp',
                  contact_email: 'john.doe@acme.com',
                  user_id: 5, // ID of the linked user account
              } as CreateClientDto,
          },
      },
  })
  @ApiResponse({
      status: 201,
      description: 'Client successfully created and linked.',
      type: Client,
  })
  @ApiResponse({
      status: 403,
      description: 'Forbidden resource (Role is not Administrator).',
  })
  async create(@Body() dto: CreateClientDto): Promise<Client> {
      return await this.clientService.createClient(dto);
  }

  // 🔑 GET ALL CLIENTS - Requires Administrator Role
  @Get()
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Get all clients (Admin Only)',
      description: 'Retrieves a list of all registered clients, including the linked user data. Requires Administrator role.',
  })
  @ApiResponse({
      status: 200,
      description: 'List of clients retrieved successfully.',
      type: [Client],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async findAll(): Promise<Client[]> {
      return await this.clientService.getAllClients();
  }

  // 🔑 GET CLIENT BY ID - Requires Administrator Role
  @Get(':id')
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Get a client by ID (Admin Only)',
      description: 'Retrieves a single client using its unique ID, including the linked user data. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      description: 'Client ID',
      example: 1,
  })
  @ApiResponse({
      status: 200,
      description: 'Client found successfully.',
      type: Client,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
      return await this.clientService.getClientById(id);
  }

  // 🔑 UPDATE CLIENT - Requires Administrator Role
  @Patch(':id')
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Update a client (Admin Only)',
      description: 'Updates an existing client using its ID. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      description: 'Client ID',
      example: 1,
  })
  @ApiResponse({
      status: 200,
      description: 'Client successfully updated.',
      type: Client,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateClientDto,
  ): Promise<Client> {
      return await this.clientService.updateClient(id, dto);
  }

  // 🔑 DELETE CLIENT - Requires Administrator Role
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Delete a client (Admin Only)',
      description: 'Removes the client record from the database using its ID. Requires Administrator role.',
  })
  @ApiParam({
      name: 'id',
      example: 3,
      description: 'Client ID',
  })
  @ApiResponse({
      status: 204,
      description: 'Client deleted successfully (No Content).',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource (Role is not Administrator).',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.clientService.deleteClient(id);
  }
}