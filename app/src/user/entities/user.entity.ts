
import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToOne } from "typeorm";


@Entity('users')
export class User {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    fullname: string;

    @Column({unique: true})
    phone: string;

    @Column({type: 'varchar'})
    address: string;
    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    birth_date: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column()
    is_active: boolean;
}