import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Client } from 'src/client/entities/client.entity'; 
import { TicketTechnician } from '../../tickettechnician/entities/tickettechnician.entity'

@Entity('tickets')
export class Ticket {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar', length: 50, default: 'Open' })
    status: string; 

    @Column({ type: 'varchar', length: 50, default: 'Medium' })
    priority: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updated_at: Date;
    
    // Foreign Key: category_id
    @ManyToOne(() => Category, (category) => category.tickets, {
        onDelete: 'RESTRICT', 
        eager: true, 
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    // Foreign Key: client_id
    @ManyToOne(() => Client, (client) => client.tickets, {
        onDelete: 'CASCADE', 
        eager: true, 
    })
    @JoinColumn({ name: 'client_id' })
    client: Client;
    
    // Relation with ticket technician con la tabla de unión TicketTechnician (1:M)
    @OneToMany(() => TicketTechnician, (ticketTechnician) => ticketTechnician.ticket)
    assignedTechnicians: TicketTechnician[];
}