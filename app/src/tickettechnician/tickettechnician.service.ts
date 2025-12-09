import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TicketTechnician } from './entities/tickettechnician.entity';
import { CreateTicketTechnicianDto } from './dto/create-tickettechnician.dto';
import { Ticket } from 'src/ticket/entities/ticket.entity'; 
import { Technician } from 'src/technician/entities/technician.entity'; 

@Injectable()
export class TicketAssignmentService {
    // 🔑 CORRECCIÓN: Debe ser 'static readonly' para que el compilador TypeScript
    // y el runtime de Nest/Swagger puedan acceder a ella sin instancia.
    public static readonly MAX_UNRESOLVED_TICKETS = 5; 
    private readonly UNRESOLVED_STATUSES = ['Open', 'In Progress'];

    constructor(
        @InjectRepository(TicketTechnician)
        private readonly assignmentRepository: Repository<TicketTechnician>,
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
    ) {}

    /**
     * Retrieves the count of unresolved tickets currently assigned to a technician.
     * Uses a single, optimized query with JOIN and WHERE clauses.
     */
    private async getUnresolvedTicketCount(technicianId: number): Promise<number> {
        // Usamos QueryBuilder para eficiencia y contar tickets SIN RESOLVER
        const count = await this.assignmentRepository.createQueryBuilder('tt')
            // Une la tabla de asignación (tt) con la tabla de tickets (t)
            .innerJoin(Ticket, 't', 't.id = tt.ticket_id')
            // Filtra por el técnico específico
            .where('tt.technician_id = :technicianId', { technicianId })
            // Filtra por los estados que consideramos 'sin resolver'
            .andWhere('t.status IN (:...statuses)', { statuses: this.UNRESOLVED_STATUSES })
            .getCount();
            
        return count;
    }

    /**
     * Assigns a technician to a ticket, including workload validation.
     */
    async assignTicket(dto: CreateTicketTechnicianDto): Promise<TicketTechnician> {
        const { ticket_id, technician_id } = dto;
        
        // 1. Check if the assignment already exists
        const existingAssignment = await this.assignmentRepository.findOne({
            where: { ticket_id, technician_id },
        });

        if (existingAssignment) {
            throw new ConflictException(`Technician ${technician_id} is already assigned to Ticket ${ticket_id}.`);
        }
        
        // 2. Validate existence of entities
        const [technician, ticket] = await Promise.all([
            this.technicianRepository.findOne({ where: { id: technician_id } }),
            this.ticketRepository.findOne({ where: { id: ticket_id } }),
        ]);

        if (!technician || !ticket) {
            throw new NotFoundException('Invalid Ticket ID or Technician ID provided. Please ensure both entities exist.');
        }

        // 3. 🛡️ WORKLOAD VALIDATION: Check if the technician has reached the limit
        const unresolvedCount = await this.getUnresolvedTicketCount(technician_id);

        if (unresolvedCount >= TicketAssignmentService.MAX_UNRESOLVED_TICKETS) { // 🔑 Uso de la propiedad static
            throw new ConflictException(
                `Technician ${technician_id} cannot be assigned. They currently have ${unresolvedCount} unresolved tickets, exceeding the limit of ${TicketAssignmentService.MAX_UNRESOLVED_TICKETS}.`
            );
        }

        try {
            const assignment = this.assignmentRepository.create(dto);
            return await this.assignmentRepository.save(assignment);
        } catch (error) {
            // Foreign key check is mostly handled by step 2, but kept for safety.
            if (error.code === '23503') { 
                throw new NotFoundException('Invalid Ticket ID or Technician ID provided. Please ensure both entities exist.');
            }
            throw new InternalServerErrorException('Failed to assign ticket due to an unexpected error.');
        }
    }

    /**
     * Finds a single assignment record by its primary key ID.
     */
    async getAssignmentById(id: number): Promise<TicketTechnician> {
        const assignment = await this.assignmentRepository.findOne({ 
            where: { id },
            relations: ['ticket', 'technician'] 
        });
        if (!assignment) {
            throw new NotFoundException(`Assignment with ID ${id} not found.`);
        }
        return assignment;
    }

    /**
     * Retrieves all ticket assignments.
     */
    async getAllAssignments(): Promise<TicketTechnician[]> {
        return this.assignmentRepository.find({
            relations: ['ticket', 'technician']
        });
    }

    /**
     * Removes a technician assignment record (unassigns the technician).
     */
    async unassignTicket(id: number): Promise<void> {
        // First check if it exists to provide a clean 404
        await this.getAssignmentById(id);
        
        const result = await this.assignmentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Assignment with ID ${id} not found.`);
        }
    }
}