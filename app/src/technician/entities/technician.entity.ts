
import { Column, Entity, PrimaryGeneratedColumn,DeleteDateColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { TicketTechnician } from '../../tickettechnician/entities/tickettechnician.entity'

@Entity('technicians')
export class Technician {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'varchar'})
    speciality: string;

    @Column({type: 'varchar'})
    availability: string;

    //Relation with user entity
   @ManyToOne(() => User, (user) => user.technicians)
   user: User;

   @OneToMany(() => TicketTechnician, (tt) => tt.technician)
    assignedTickets: TicketTechnician[];
}