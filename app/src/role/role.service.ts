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
    ) { }

    // CREATE ROLE
    async createRole(dto: CreateRoleDto): Promise<Role> {
        if (!dto) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            const newRole = this.roleRepository.create(dto);
            return await this.roleRepository.save(newRole);
        } catch (err: any) {
            if (err.code === '23505') {
                throw new ConflictException(
                    'Role already exists or violates a unique constraint.',
                );
            }
            throw new InternalServerErrorException('Error creating role.');
        }
    }

    // GET ALL ROLES
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles = await this.roleRepository.find();

            if (!roles || roles.length === 0) {
                throw new NotFoundException('No roles found.');
            }

            return roles;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error fetching roles.');
        }
    }

    // GET ROLE BY ID
    async getRoleById(id: number): Promise<Role> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const role = await this.roleRepository.findOne({
                where: { id_role: id },
            });

            if (!role) {
                throw new NotFoundException(`Role with id ${id} not found.`);
            }

            return role;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error fetching role.');
        }
    }

    // UPDATE ROLE BY ID
    async updateRoleById(id: number, dto: UpdateRoleDTO): Promise<Role> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            const existing = await this.roleRepository.findOne({
                where: { id_role: id },
            });

            if (!existing) {
                throw new NotFoundException(`Role with id ${id} not found.`);
            }

            Object.assign(existing, dto);
            const updated = await this.roleRepository.save(existing);
            return updated;
        } catch (err: any) {
            if (err?.response?.statusCode) throw err;

            if (err.code === '23505') {
                throw new ConflictException(
                    'Role data violates a unique constraint.',
                );
            }

            throw new InternalServerErrorException('Error updating role.');
        }
    }

    // DELETE ROLE BY ID (hard delete)
    async deleteRoleById(id: number): Promise<{ message: string }> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const existing = await this.roleRepository.findOneBy({ id_role: id });

            if (!existing) {
                throw new NotFoundException(`Role with id ${id} not found.`);
            }

            const result = await this.roleRepository.delete({ id_role: id });

            if (!result || result.affected === 0) {
                throw new NotFoundException(
                    `Role with id ${id} not found or not deleted.`,
                );
            }

            return { message: 'Role deleted successfully.' };
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error deleting role.');
        }
    }
}
