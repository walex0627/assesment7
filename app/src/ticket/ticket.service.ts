import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    // 🔑 ADDED: Needed for status validation
    BadRequestException, 
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// 🔑 ADDED: Needed for getTicketsByTechnicianId (modern approach uses In, or findByIds requires it)
import { Repository, In } from 'typeorm'; 
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketTechnician } from '../tickettechnician/entities/tickettechnician.entity'; 

@Injectable()
export class TicketService {
    // 🔑 ADDED: Property required for updateTicketStatus validation
    private readonly VALID_STATUSES = ['Open', 'In Progress', 'Closed'];

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        
        // Injected repository for the junction table
        @InjectRepository(TicketTechnician)
        private readonly assignmentRepository: Repository<TicketTechnician>,
    ) {}

    // -----------------------------------------------------------------
    // CORE CRUD
    // -----------------------------------------------------------------

    /**
     * Creates a new support ticket and links it to a Category and Client.
     */
    async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const ticketData = {
            ...createTicketDto,
            category: { id: createTicketDto.category_id },
            client: { id: createTicketDto.client_id },
        };
        
        try {
            const ticket = this.ticketRepository.create(ticketData);
            return await this.ticketRepository.save(ticket);
        } catch (error) {
            if (error.code === '23503') { 
                throw new NotFoundException('Invalid Category ID or Client ID provided. Please ensure both entities exist.');
            }
            throw new InternalServerErrorException('Failed to create ticket due to an unexpected error.');
        }
    }

    /**
     * Retrieves all tickets, including related Category and Client data.
     */
    async getAllTickets(): Promise<Ticket[]> {
        return this.ticketRepository.find();
    }

    /**
     * Retrieves a single ticket by ID. Throws NotFoundException if not found.
     */
    async getTicketById(id: number): Promise<Ticket> {
        // 🔑 CORRECTION: Ensure relations needed by PolicyGuard (client, client.user) are loaded
        const ticket = await this.ticketRepository.findOne({ 
            where: { id },
            relations: ['client', 'client.user'] 
        });
        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found.`);
        }
        return ticket;
    }

    /**
     * Updates an existing ticket's details (excluding status).
     */
    async updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.getTicketById(id); 

        const ticketUpdateData: any = updateTicketDto;
        if (updateTicketDto.category_id !== undefined) {
             ticketUpdateData.category = { id: updateTicketDto.category_id };
             delete ticketUpdateData.category_id;
        }
        if (updateTicketDto.client_id !== undefined) {
             ticketUpdateData.client = { id: updateTicketDto.client_id };
             delete ticketUpdateData.client_id;
        }
        
        this.ticketRepository.merge(ticket, ticketUpdateData);

        try {
            return await this.ticketRepository.save(ticket);
        } catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException('Invalid Category ID or Client ID provided in update.');
            }
            throw new InternalServerErrorException('Failed to update ticket due to an unexpected error.');
        }
    }

    /**
     * Deletes a ticket by ID (Hard Delete).
     */
    async deleteTicket(id: number): Promise<void> {
        await this.getTicketById(id);
        
        const result = await this.ticketRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Ticket with ID ${id} not found.`);
        }
    }

    // -----------------------------------------------------------------
    // DYNAMIC ACCESS AND MUTATION METHODS
    // -----------------------------------------------------------------

    /**
     * Updates only the status of a specific ticket. Used by PATCH /tickets/:id/status.
     */
    async updateTicketStatus(id: number, status: string): Promise<Ticket> {
        if (!this.VALID_STATUSES.includes(status)) {
            throw new BadRequestException(`Invalid status provided. Must be one of: ${this.VALID_STATUSES.join(', ')}.`);
        }
        
        const updateResult = await this.ticketRepository.update(id, { status, updated_at: new Date() });
        
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Ticket with ID ${id} not found.`);
        }
        
        return this.getTicketById(id);
    }
    
    /**
     * Retrieves all tickets associated with a specific client ID. Used by GET /tickets/client/:id.
     */
    async getTicketsByClientId(clientId: number): Promise<Ticket[]> {
        return this.ticketRepository.find({
            where: {
                client: { id: clientId } 
            },
            relations: ['category', 'assignedTechnicians'] 
        });
    }

    /**
     * Retrieves all tickets currently assigned to a specific technician ID. Used by GET /tickets/technician/:id.
     */
    async getTicketsByTechnicianId(technicianId: number): Promise<Ticket[]> {
        const assignments = await this.assignmentRepository.find({
            where: {
                technician_id: technicianId,
            },
            select: ['ticket_id'],
        });

        const ticketIds = assignments.map(a => a.ticket_id);

        if (ticketIds.length === 0) {
            return [];
        }

        // Use the 'In' operator for compatibility with modern TypeORM versions
        return this.ticketRepository.find({
            where: {
                id: In(ticketIds),
            },
            relations: ['client', 'category'],
        });
    }

    /**
     * Checks the TicketTechnician junction table to determine if a specific technician
     * is currently assigned to a specific ticket. Used by the PolicyGuard.
     */
    async isTechnicianAssignedToTicket(technicianId: number, ticketId: number): Promise<boolean> {
        const assignment = await this.assignmentRepository.findOne({
            where: {
                technician_id: technicianId,
                ticket_id: ticketId,
            },
        });
        
        return !!assignment;
    }
}