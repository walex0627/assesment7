// src/access/access.service.ts
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Access } from './entities/access.entity';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Access)
        private readonly accessRepository: Repository<Access>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    // CREATE ACCESS (REGISTER CREDENTIALS)
    async createAccess(dto: CreateAccessDto): Promise<Access> {
        if (!dto) {
            throw new BadRequestException('Payload is required.');
        }

        const { user_id, role_id, ...rest } = dto;

        try {
            const user = await this.userRepository.findOne({
                where: { id_user: user_id },
            });

            if (!user) {
                throw new BadRequestException(`User with id ${user_id} not found.`);
            }

            const role = await this.roleRepository.findOne({
                where: { id_role: role_id },
            });

            if (!role) {
                throw new BadRequestException(`Role with id ${role_id} not found.`);
            }

            const newAccess = this.accessRepository.create({
                ...rest, // email, password
                user,
                role,
            });

            return await this.accessRepository.save(newAccess);
        } catch (err: any) {
            if (err?.response?.statusCode) throw err;

            if (err.code === '23505') {
                throw new ConflictException(
                    'Access record already exists or violates a unique constraint (email).',
                );
            }

            throw new InternalServerErrorException('Error creating access record.');
        }
    }

    // GET ALL ACCESS RECORDS
    async getAllAccess(): Promise<Access[]> {
        try {
            const accessRecords = await this.accessRepository.find({
                relations: ['user', 'role'],
            });

            if (!accessRecords || accessRecords.length === 0) {
                throw new NotFoundException('No access records found.');
            }

            return accessRecords;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error fetching access records.');
        }
    }

    // GET ACCESS BY ID
    async getAccessById(id: number): Promise<Access> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const access = await this.accessRepository.findOne({
                where: { id_access: id },
                relations: ['user', 'role'],
            });

            if (!access) {
                throw new NotFoundException(`Access record with id ${id} not found.`);
            }

            return access;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException(
                'Error fetching access record by id.',
            );
        }
    }

    // UPDATE ACCESS
    async updateAccess(id: number, dto: UpdateAccessDto): Promise<Access> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            const existing = await this.accessRepository.findOne({
                where: { id_access: id },
                relations: ['user', 'role'],
            });

            if (!existing) {
                throw new NotFoundException(
                    `Access record with id ${id} not found.`,
                );
            }

            // Cambiar user si viene user_id
            if ('user_id' in dto && dto.user_id !== undefined) {
                const newUser = await this.userRepository.findOne({
                    where: { id_user: dto.user_id },
                });

                if (!newUser) {
                    throw new BadRequestException(
                        `User with id ${dto.user_id} not found.`,
                    );
                }

                existing.user = newUser;
                delete (dto as any).user_id;
            }

            // Cambiar role si viene role_id
            if ('role_id' in dto && dto.role_id !== undefined) {
                const newRole = await this.roleRepository.findOne({
                    where: { id_role: dto.role_id },
                });

                if (!newRole) {
                    throw new BadRequestException(
                        `Role with id ${dto.role_id} not found.`,
                    );
                }

                existing.role = newRole;
                delete (dto as any).role_id;
            }

            Object.assign(existing, dto); // email, password si vienen
            const updated = await this.accessRepository.save(existing);
            return updated;
        } catch (err: any) {
            if (err?.response?.statusCode) throw err;

            if (err.code === '23505') {
                throw new ConflictException(
                    'Access data violates a unique constraint (email).',
                );
            }

            throw new InternalServerErrorException('Error updating access record.');
        }
    }

    // DELETE ACCESS
    async deleteAccess(id: number): Promise<{ message: string }> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const existing = await this.accessRepository.findOneBy({
                id_access: id,
            });

            if (!existing) {
                throw new NotFoundException(
                    `Access record with id ${id} not found.`,
                );
            }

            const result = await this.accessRepository.delete({
                id_access: id,
            });

            if (!result || result.affected === 0) {
                throw new NotFoundException(
                    `Access record with id ${id} not found or not deleted.`,
                );
            }

            return { message: 'Access record deleted successfully.' };
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException(
                'Error deleting access record.',
            );
        }
    }

    // usado por AuthService.login
    async getAccessByEmail(email: string): Promise<Access | null> {
        try {
            return await this.accessRepository.findOne({
                where: { email },
                relations: ['user', 'role'],
            });
        } catch (err: any) {
            throw new InternalServerErrorException(
                'Error fetching access record by email.',
            );
        }
    }
}
