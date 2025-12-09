import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique
} from 'typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity'; 
import { Technician } from 'src/technician/entities/technician.entity'; // Asegúrate de que esta ruta sea correcta

@Entity('ticket_technician')
@Unique(['technician_id', 'ticket_id']) 
export class TicketTechnician {
    
    @PrimaryGeneratedColumn({ name: 'id_ticket_technician' })
    id: number;

    // FK  of technician
    @Column({ name: 'technician_id' })
    technician_id: number;
    
    @ManyToOne(() => Technician, (technician) => technician.assignedTickets, { 
        onDelete: 'RESTRICT', 
        eager: false 
    })
    @JoinColumn({ name: 'technician_id' })
    technician: Technician;


    // FK del Ticket
    @Column({ name: 'ticket_id' })
    ticket_id: number;

    //relation with titcket entity
    @ManyToOne(() => Ticket, (ticket) => ticket.assignedTechnicians, { 
        onDelete: 'CASCADE', 
        eager: false 
    })
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;

    @CreateDateColumn({ name: 'assigned_at', type: 'timestamp with time zone' })
    assigned_at: Date;
}