import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

    ) {}

    //Method to create role
    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const role = this.roleRepository.create(createRoleDto);
        try {
            await this.roleRepository.save(role);
            return role;
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Role already exists');
            }
            throw new InternalServerErrorException();
        }
    }

    //Method to get all roles 
    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    //Method to get role by id
    async getRoleById(id: number): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }   

    //Method to update a role
    async updateRole(id: number, updateRoleDto: UpdateRoleDTO): Promise<Role> {
        const role = await this.getRoleById(id);
        this.roleRepository.merge(role, updateRoleDto);
        try {
            await this.roleRepository.save(role);
            return role;
            } catch (error) {
            throw new InternalServerErrorException();
        }
    }       

    //method to delete a role 
    async deleteRole(id: number): Promise<void> {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Role not found');
        }
    }
}
