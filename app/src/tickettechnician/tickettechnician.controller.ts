import {
  Controller,
  Get,
  Post,
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

import { TicketAssignmentService } from './tickettechnician.service'; 
import { CreateTicketTechnicianDto } from './dto/create-tickettechnician.dto';
import { TicketTechnician } from './entities/tickettechnician.entity';

@ApiTags('Ticket Assignments')
@Controller('assignments')
export class TicketAssignmentController {
  constructor(private readonly assignmentService: TicketAssignmentService) {}

  // ASSIGN TICKET (CREATE)
  @Post()
  @ApiOperation({
      summary: 'Assign a technician to a ticket',
      description: `Creates a new assignment record linking a technician to a ticket. This operation validates that the technician has fewer than ${TicketAssignmentService.MAX_UNRESOLVED_TICKETS} unresolved tickets ('Open' or 'In Progress') before creating the assignment.`,
  })
  @ApiBody({
      type: CreateTicketTechnicianDto,
      examples: {
          basic: {
              summary: 'Example assignment',
              value: {
                  technician_id: 1, 
                  ticket_id: 101,   
              } as CreateTicketTechnicianDto,
          },
      },
  })
  @ApiResponse({
      status: 201,
      description: 'Ticket successfully assigned.',
      type: TicketTechnician,
    })
  @ApiResponse({
      status: 404,
      description: 'Invalid Ticket ID, Technician ID, or an entity was not found.',
  })
  @ApiResponse({
      // 🔑 CORRECCIÓN: Acceso estático (Clase.Propiedad) para el decorador
      status: 409,
      description: `Conflict: Technician is already assigned to this ticket, or the technician has reached the maximum limit of ${TicketAssignmentService.MAX_UNRESOLVED_TICKETS} unresolved tickets.`,
  })
  async assign(@Body() dto: CreateTicketTechnicianDto): Promise<TicketTechnician> {
      return await this.assignmentService.assignTicket(dto);
  }

  // GET ALL ASSIGNMENTS
  @Get()
  @ApiOperation({
      summary: 'Get all ticket assignments',
      description: 'Retrieves a list of all existing technician-ticket assignments, including related entities.',
  })
  @ApiResponse({
      status: 200,
      description: 'List of assignments retrieved successfully.',
      type: [TicketTechnician],
  })
  async findAll(): Promise<TicketTechnician[]> {
      return await this.assignmentService.getAllAssignments();
  }
  
  // GET ASSIGNMENT BY ID (PK of the join table)
  @Get(':id')
  @ApiOperation({
      summary: 'Get assignment by ID',
      description: 'Retrieves a single assignment record using its primary key (id_ticket_technician).',
  })
  @ApiParam({
      name: 'id',
      description: 'Assignment ID (id_ticket_technician)',
      example: 5,
  })
  @ApiResponse({
      status: 200,
      description: 'Assignment found successfully.',
      type: TicketTechnician,
  })
  @ApiResponse({
      status: 404,
      description: 'Assignment record not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TicketTechnician> {
      return await this.assignmentService.getAssignmentById(id);
  }


  // UNASSIGN TICKET (DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({
      summary: 'Unassign a technician from a ticket',
      description: 'Deletes the assignment record using its primary key, effectively unassigning the technician from the ticket.',
  })
  @ApiParam({
      name: 'id',
      example: 3,
      description: 'Assignment ID (id_ticket_technician)',
  })
  @ApiResponse({
      status: 204,
      description: 'Assignment deleted successfully (No Content).',
  })
  @ApiResponse({
      status: 404,
      description: 'Assignment not found.',
  })
  async unassign(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.assignmentService.unassignTicket(id);
  }
}