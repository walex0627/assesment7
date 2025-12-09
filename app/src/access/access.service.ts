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

    // -----------------------------------------------------------------
    // CREATE ACCESS (REGISTER CREDENTIALS)
    // -----------------------------------------------------------------
    async createAccess(dto: CreateAccessDto): Promise<Access> {
        if (!dto) {
            throw new BadRequestException('Payload is required.');
        }

        const { user_id, role_id, ...rest } = dto;

        try {
            // Validate User FK
            const user = await this.userRepository.findOne({
                where: { id: user_id },
            });

            if (!user) {
                // 🔑 Use NotFoundException for FK dependency not found
                throw new NotFoundException(`User with id ${user_id} not found.`);
            }

            // Validate Role FK
            const role = await this.roleRepository.findOne({
                where: { id: role_id },
            });

            if (!role) {
                // 🔑 Use NotFoundException for FK dependency not found
                throw new NotFoundException(`Role with id ${role_id} not found.`);
            }

            const newAccess = this.accessRepository.create({
                ...rest, // email, password
                user,
                role,
            });

            return await this.accessRepository.save(newAccess);
        } catch (err: any) {
            // 🔑 Do not capture and rethrow specific HTTP exceptions (like 404/400)
            if (err instanceof NotFoundException || err instanceof BadRequestException) {
                throw err;
            }

            if (err.code === '23505') { // PostgreSQL Unique Violation
                throw new ConflictException(
                    'Access record already exists or violates a unique constraint (email).',
                );
            }

            throw new InternalServerErrorException('Error creating access record.');
        }
    }

    // -----------------------------------------------------------------
    // GET ALL ACCESS RECORDS
    // -----------------------------------------------------------------
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
            if (err instanceof NotFoundException) throw err;
            throw new InternalServerErrorException('Error fetching access records.');
        }
    }

    // -----------------------------------------------------------------
    // GET ACCESS BY ID
    // -----------------------------------------------------------------
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
            if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
            throw new InternalServerErrorException('Error fetching access record by id.');
        }
    }

    // -----------------------------------------------------------------
    // UPDATE ACCESS
    // -----------------------------------------------------------------
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
                throw new NotFoundException(`Access record with id ${id} not found.`);
            }

            // Cambiar user si viene user_id
            if ('user_id' in dto && dto.user_id !== undefined) {
                const newUser = await this.userRepository.findOne({
                    where: { id: dto.user_id },
                });

                if (!newUser) {
                    throw new NotFoundException(`User with id ${dto.user_id} not found.`);
                }

                existing.user = newUser;
                delete (dto as any).user_id;
            }

            // Cambiar role si viene role_id
            if ('role_id' in dto && dto.role_id !== undefined) {
                const newRole = await this.roleRepository.findOne({
                    where: { id: dto.role_id },
                });

                if (!newRole) {
                    throw new NotFoundException(`Role with id ${dto.role_id} not found.`);
                }

                existing.role = newRole;
                delete (dto as any).role_id;
            }

            Object.assign(existing, dto); // email, password si vienen
            const updated = await this.accessRepository.save(existing);
            return updated;
        } catch (err: any) {
            if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;

            if (err.code === '23505') {
                throw new ConflictException('Access data violates a unique constraint (email).');
            }

            throw new InternalServerErrorException('Error updating access record.');
        }
    }

    // -----------------------------------------------------------------
    // DELETE ACCESS
    // -----------------------------------------------------------------
    async deleteAccess(id: number): Promise<{ message: string }> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            // Check existence before attempting delete
            const existing = await this.accessRepository.findOneBy({ id_access: id });

            if (!existing) {
                throw new NotFoundException(`Access record with id ${id} not found.`);
            }

            const result = await this.accessRepository.delete({ id_access: id });

            if (result.affected === 0) {
                // Should not happen if existence check passed, but good for safety
                throw new NotFoundException(`Access record with id ${id} not deleted.`);
            }

            return { message: 'Access record deleted successfully.' };
        } catch (err: any) {
            if (err instanceof NotFoundException || err instanceof BadRequestException) throw err;
            throw new InternalServerErrorException('Error deleting access record.');
        }
    }

    // -----------------------------------------------------------------
    // GET ACCESS BY EMAIL (USED BY AUTHSERVICE)
    // -----------------------------------------------------------------
    /**
     * Retrieves an Access record by email, optionally loading specified relations.
     * This method is used by AuthService for login and token generation.
     * @param email The email to search for.
     * @param relations Optional relations to load (e.g., ['role', 'user']).
     * @returns The Access entity or null.
     */
    async getAccessByEmail(email: string, relations: string[] = []): Promise<Access | null> {
        try {
            return await this.accessRepository.findOne({
                where: { email },
                // 🔑 CORRECTION: Use the optional relations argument
                relations: relations.length > 0 ? relations : undefined,
            });
        } catch (err: any) {
            // Do not rethrow HTTP exceptions; assume only internal errors here.
            throw new InternalServerErrorException('Error fetching access record by email.');
        }
    }
}