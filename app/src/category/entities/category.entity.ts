import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    // Relation with ticket
    @OneToMany(type => Ticket, ticket => ticket.category)
    tickets: Ticket[];


}
