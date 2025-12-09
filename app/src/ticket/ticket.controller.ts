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

import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
// 🔑 Essential for PolicyGuard to read required roles
import { Roles } from 'src/common/decorators/roles.decorator'; 


@ApiTags('Tickets')
@Controller('tickets')
// NOTE: PolicyGuard/JwtAuthGuard is assumed to be configured GLOBALLY.
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // =================================================================
  // STANDARD CRUD OPERATIONS
  // =================================================================

  // 🔑 1. CREATE TICKET (POST /tickets) - Restricted to Clients
  @Post()
  @Roles('Client') 
  @ApiOperation({
      summary: 'Create a new support ticket (Client Only)',
      description: 'Submits a new ticket, linking it to a specific client and category. Requires Client role.',
  })
  @ApiResponse({ status: 201, description: 'Ticket successfully created.', type: Ticket })
  @ApiResponse({ status: 403, description: 'Forbidden resource (Role is not Client).' })
  async create(@Body() dto: CreateTicketDto): Promise<Ticket> {
      return await this.ticketService.createTicket(dto);
  }

  // 🔑 2. GET ALL TICKETS (GET /tickets) - Restricted to Administrator
  @Get()
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Get all tickets (Admin Only)',
      description: 'Retrieves a list of all support tickets. Only accessible by Administrator.',
  })
  @ApiResponse({ status: 200, description: 'List of tickets retrieved successfully.', type: [Ticket] })
  @ApiResponse({ status: 403, description: 'Forbidden resource (Only Admin can list all).' })
  async findAll(): Promise<Ticket[]> {
      return await this.ticketService.getAllTickets();
  }

  // 🔑 3. GET TICKET BY ID (GET /tickets/:id) - Dynamic Policy Check
  @Get(':id')
  @ApiOperation({
      summary: 'Get a single ticket (Dynamic Access)',
      description: 'Retrieves a single ticket. Access granted only if the user is an Administrator, the Client owner, or an Assigned Technician.',
  })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Ticket found successfully.', type: Ticket })
  @ApiResponse({ status: 403, description: 'Forbidden access (User does not meet ownership/assignment criteria).' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
      // The PolicyGuard ensures authorization based on the URL and user role.
      return await this.ticketService.getTicketById(id);
  }

  // 🔑 4. UPDATE TICKET (PATCH /tickets/:id) - Restricted to Administrator
  @Patch(':id')
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Update ticket details (Admin Only)',
      description: 'Updates ticket fields (description, priority, category). Status updates are handled separately. Requires Administrator role.',
  })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Ticket successfully updated.', type: Ticket })
  @ApiResponse({ status: 403, description: 'Forbidden resource (Role is not Administrator).' })
  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateTicketDto,
  ): Promise<Ticket> {
      return await this.ticketService.updateTicket(id, dto);
  }
  
  // 🔑 5. DELETE TICKET (DELETE /tickets/:id) - Restricted to Administrator
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @Roles('Administrator') 
  @ApiOperation({
      summary: 'Permanently delete a ticket (Admin Only)',
      description: 'Removes the ticket record from the database. Requires Administrator role.',
  })
  @ApiResponse({ status: 204, description: 'Ticket deleted successfully (No Content).' })
  @ApiResponse({ status: 403, description: 'Forbidden resource (Role is not Administrator).' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.ticketService.deleteTicket(id);
  }

  // =================================================================
  // SPECIFIC/DYNAMIC POLICY ENDPOINTS
  // =================================================================

  // 🔑 A. PATCH /tickets/:id/status - Dynamic Policy Check (Technician Assigned)
  @Patch(':id/status')
  @ApiOperation({
      summary: 'Update ticket status (Assigned Technician or Admin Only)',
      description: 'Changes the status of a ticket. Access is granted only if the user is an Administrator or the Assigned Technician.',
  })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: 1 })
  @ApiBody({
    schema: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['Open', 'In Progress', 'Closed'] } }
    },
  })
  @ApiResponse({ status: 200, description: 'Status successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden access (Technician is not assigned).' })
  async updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status') status: string,
  ): Promise<Ticket> {
      // The PolicyGuard ensures authorization based on the URL and user role.
      return await this.ticketService.updateTicketStatus(id, status);
  }

  // 🔑 B. GET /tickets/client/:id - Dynamic Policy Check (Client History)
  @Get('client/:id')
  @ApiOperation({
      summary: 'Get client ticket history (Client Owner or Admin Only)',
      description: 'Retrieves all tickets submitted by a specific Client ID. Access granted only if the user is an Administrator or the matching Client.',
  })
  @ApiParam({ name: 'id', description: 'Client ID (to query)', example: 5 })
  @ApiResponse({ status: 200, description: 'List of client tickets retrieved.' })
  @ApiResponse({ status: 403, description: 'Forbidden access (Client can only view their own ID).' })
  async getTicketsByClient(@Param('id', ParseIntPipe) clientId: number): Promise<Ticket[]> {
      // The PolicyGuard ensures the requesting user matches the requested clientId (if they are a Client).
      return await this.ticketService.getTicketsByClientId(clientId);
  }

  // 🔑 C. GET /tickets/technician/:id - Dynamic Policy Check (Technician List)
  @Get('technician/:id')
  @ApiOperation({
      summary: 'Get assigned technician tickets (Technician Self-view or Admin Only)',
      description: 'Retrieves all tickets assigned to a specific Technician ID. Access granted only if the user is an Administrator or the matching Technician.',
  })
  @ApiParam({ name: 'id', description: 'Technician ID (to query)', example: 1 })
  @ApiResponse({ status: 200, description: 'List of assigned tickets retrieved.' })
  @ApiResponse({ status: 403, description: 'Forbidden access (Technician can only view their own ID).' })
  async getTicketsByTechnician(@Param('id', ParseIntPipe) technicianId: number): Promise<Ticket[]> {
      // The PolicyGuard ensures the requesting user matches the requested technicianId (if they are a Technician).
      return await this.ticketService.getTicketsByTechnicianId(technicianId);
  }
}