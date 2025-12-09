import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Exclude } from 'class-transformer';

@Entity('Access')
export class Access {
    @PrimaryGeneratedColumn()
    id_access: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    // RELATION → USER
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // RELATION → ROLE
    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

}
