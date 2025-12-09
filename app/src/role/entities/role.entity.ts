import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Access } from 'src/access/entities/access.entity';

@Entity('roles')
export class Role {
    // Define your entity columns and relations here

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;
    //Relations with access entity
    @OneToMany(() => Access, (access) => access.role)
    accesses: Access[];
}
