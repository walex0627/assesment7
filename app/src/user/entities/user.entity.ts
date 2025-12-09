
import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Access } from "../../access/entities/access.entity";
import { Technician } from "../../technician/entities/technician.entity";
import { Client } from "../../client/entities/client.entity";

@Entity('users')
export class User {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'varchar'})
    address: string;

    @Column({unique:true})
    phone: string;

    //Relation with access entity
    @OneToMany(() => Access, access => access.user)
    accesses: Access[];
    //Relation with technician entity
    @OneToMany(() => Technician, technician => technician.user)
    technicians: Technician[];
    // Relation with Client entity
    @OneToOne(() => Client, client => client.user)
    client: Client;
    

}